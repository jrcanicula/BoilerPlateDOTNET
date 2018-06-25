using Dapper;
using Ensley.Core.Extensions.Wrapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Extensions
{
	public static class DapperExtensions
	{
		//reference from http://www.bradoncode.com/blog/2012/12/creating-data-repository-using-dapper.html
		public static T Insert<T>(this IDbConnection cnn,string tableName,string primaryIdName,dynamic param,bool tableWithTrigger = false,bool withPrimaryId = false)
		{
			string query = DynamicQuery.GetInsertQuery(tableName,primaryIdName,param,tableWithTrigger,withPrimaryId);
			IEnumerable<T> result = SqlMapper.Query<T>(cnn,query,param);

			if (result.Count() > 0)
			{
				return result.First();
			}
			else if (withPrimaryId)
			{
				PropertyInfo[] props = param.GetType().GetProperties();
				object data = props.FirstOrDefault(s => s.Name == primaryIdName);
				return (T)((PropertyInfo)data).GetValue(param);
			}
			else
			{
				object data = Guid.Parse(query.Split('\'')[1]);
				return (T)data;
			}

		}

		public static void Update(this IDbConnection cnn,string tableName,string primaryIdName,dynamic param)
		{
			SqlMapper.Execute(cnn,DynamicQuery.GetUpdateQuery(tableName,primaryIdName,param),param);
		}

		public static async Task InsertAsync<T>(this IDbConnection cnn,string tableName,string primaryIdName,dynamic param)
		{
			await SqlMapper.Query<T>(cnn,DynamicQuery.GetInsertQuery(tableName,primaryIdName,param),param);
		}
	}
}
