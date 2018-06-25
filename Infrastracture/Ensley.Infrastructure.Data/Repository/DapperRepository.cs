using Dapper;
using Microsoft.AspNetCore.Http;
using Ensley.Core;
using Ensley.Core.Common;
using Ensley.Core.Domain.Config;
using Ensley.Core.Extensions;
using Ensley.Core.Extensions.Wrapper;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.RepositoryInterface.Config;
using Ensley.Core.Security;
using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Data.Repository
{
	public abstract class DapperRepository<T>:IDapperRepository<T> where T : class
	{
		private readonly string _tableName;
		private static string _connectionString;
		private readonly IHttpContextAccessor _contextAccessor;
		private string primaryIdentifier
		{
			get
			{
				T i = default(T);
				return GetIdentifierProperty(i).Name;
			}
		}

		public DapperRepository(string tableName,IHttpContextAccessor contextAccessor,IOrganizationsRepository orgRepository)
		{
			_tableName = tableName;
			var subDomainName = string.Empty;
			subDomainName = "demo";
			//subDomainName = Common.GetSubDomainByContextRequest(contextAccessor.HttpContext);

			Organizations org = null;
			//if (org != null && org.IsActive)
			org = orgRepository.GetConfigOrganizationByName(subDomainName != null ? subDomainName : "demo");

			_connectionString = org.ConnectionString;
			_contextAccessor = contextAccessor;
		}

		public DapperRepository(string connectionString,string tableName,IHttpContextAccessor contextAccessor)
		{
			_connectionString = connectionString;
			_tableName = tableName;
		}

		private void SetPrimaryIdentifierValue(T item,Guid id)
		{
			T i = default(T);
			var prop = GetIdentifierProperty(i);
			prop.SetValue(item,id);
		}

		public IDbConnection Connection
		{
			get
			{
				return new SqlConnection(_connectionString);
			}
		}

		internal virtual dynamic Mapping(T item)
		{
			return item;
		}

		public Guid Add(T item,bool tableWithTrigger = false)
		{
			UpdateAuditable(false,item);
			using (IDbConnection cn = Connection)
			{
				var parameters = (object)Mapping(item);
				cn.Open();

				var id = cn.Insert<Guid>(_tableName,primaryIdentifier,parameters,tableWithTrigger);
				SetPrimaryIdentifierValue(item,id);
				return id;
			}
		}

		public async Task AddAsync(T item)
		{
			UpdateAuditable(false,item);
			using (IDbConnection cn = Connection)
			{
				var parameters = (object)Mapping(item);
				cn.Open();
				await cn.InsertAsync<Guid>(_tableName,primaryIdentifier,parameters);
			}
		}

		public IEnumerable<T> Find(Expression<Func<T,bool>> predicate)
		{
			IEnumerable<T> items = null;
			// extract the dynamic sql query and parameters from predicate
			QueryResult result = DynamicQuery.GetDynamicQuery(_tableName,predicate);
			using (IDbConnection cn = Connection)
			{
				cn.Open();
				items = cn.Query<T>(result.Sql,(object)result.Param);
			}

			return items;
		}

		public PropertyInfo GetIdentifierProperty(T obj)
		{
			var prop = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
								 .FirstOrDefault(p => p.GetCustomAttributes(typeof(IdentifierAttribute),false).Count() == 1);

			return prop;
		}

		public IEnumerable<T> FindAll()
		{
			IEnumerable<T> items = null;
			using (IDbConnection cn = Connection)
			{
				cn.Open();
				items = cn.Query<T>("SELECT * FROM " + _tableName).ToList();
			}

			return items;
		}

		public IEnumerable<TY> FindAll<TY>() where TY : class
		{
			IEnumerable<TY> item = new List<TY>();
			using (IDbConnection cn = Connection)
			{
				cn.Open();
				item = cn.Query<TY>("SELECT * FROM " + _tableName);
			}
			return item;
		}

		public T FindByID(Guid id)
		{
			T item = default(T);
			using (IDbConnection cn = Connection)
			{
				cn.Open();
				item = cn.Query<T>("SELECT * FROM " + _tableName + " WHERE " + primaryIdentifier + "=@ID",new { ID = id }).SingleOrDefault();
			}

			return item;
		}

		public TY FindByID<TY>(Guid id) where TY : class
		{
			TY item = default(TY);

			using (IDbConnection cn = Connection)
			{
				cn.Open();
				item = cn.Query<TY>("SELECT * FROM " + _tableName + " WHERE " + primaryIdentifier + "=@ID",new { ID = id }).SingleOrDefault();
			}

			return item;
		}

		public virtual void Remove(Guid Id)
		{
			using (IDbConnection cn = Connection)
			{
				cn.Open();
				cn.Execute("DELETE FROM " + _tableName + " WHERE " + primaryIdentifier + "=@ID",new { ID = Id });
			}
		}

		public void Update(T item)
		{
			UpdateAuditable(true,item);
			using (IDbConnection cn = Connection)
			{
				var parameters = (object)Mapping(item);
				cn.Open();
				cn.Update(_tableName,primaryIdentifier,parameters);
			}
		}

		private void UpdateAuditable(bool edit,T item)
		{
			Guid userInfoId = Guid.Empty;
			if (_contextAccessor != null)
			{
				userInfoId = Security.GetUserInfoId(_contextAccessor.HttpContext.User.Identity);
			}

			if (typeof(Auditable).IsAssignableFrom(typeof(T)))
			{
				SetPropertyValue(item,"ModifiedBy",userInfoId);
				SetPropertyValue(item,"ModifiedOn",Localization.GetUTCDateNow());

				if (!edit)
				{
					SetPropertyValue(item,"CreatedBy",userInfoId);
					SetPropertyValue(item,"CreatedOn",Localization.GetUTCDateNow());
				}
			}
		}

		private void SetPropertyValue(T item,string propertyName,object value)
		{
			var propInfo = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance).FirstOrDefault(v => v.Name == propertyName);
			propInfo.SetValue(item,value);
		}
	}
}
