using Dapper;
using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain.Config;
using Ensley.Core.RepositoryInterface.Config;
using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Data.Repository.Config
{
	public class OrganizationsRepository:DapperRepository<Organizations>, IOrganizationsRepository
	{
		private static object _lock = new object();

		public OrganizationsRepository(IHttpContextAccessor contextAccessor) :
				base(Common.ConfigConnectionString,"Organizations",contextAccessor)
		{
		}

		public void CreateOrganizationDatabase(Organizations org,string templateDbName,string dbName)
		{
			using (var con = Connection)
			{
				if (Common.Environment != "DEV")
				{

					con.Execute("sp_CopyDefaultDbAzure",new { DBName = dbName,TemplateDB = templateDbName },commandType: CommandType.StoredProcedure,commandTimeout: 0);
				}
				else
				{
					con.Execute("sp_CopyDefaultDB",new { DBName = dbName,TemplateDB = templateDbName },commandType: CommandType.StoredProcedure,commandTimeout: 0);
				}
			}
		}

		public Organizations GetOrganizationStatus(Guid id)
		{
			var org = FindAll().FirstOrDefault(v => v.OrganizationId == id);
			return org;
		}

		public Organizations GetConfigOrganizationByName(string name)
		{
			var test = FindAll();
			var org = FindAll().FirstOrDefault(v => v.Name.ToLower() == name.ToLower() || v.FriendlyName.ToLower() == name.ToLower());
			return org;
		}

		public string GetDatabaseNameByOrganization(Organizations organization)
		{
			var dbName = string.Format("{0}-{1}",organization.FriendlyName,Common.Environment);
			return dbName;
		}
		public string GetConnectionStringByOrganization(IHttpContextAccessor contextAccessor)
		{
			Organizations organizations = null;
			var subDomainName = Common.GetSubDomainByContextRequest(contextAccessor.HttpContext);
			organizations = GetConfigOrganizationByName(subDomainName);
			return organizations.ConnectionString;
		}

		public Organizations GetOrganizationByName(string name)
		{
			return FindAll().FirstOrDefault(c => c.FriendlyName.ToLower() == name);
		}

		public bool IsOrganizationDbReadOnly(string connectionString,string dbName)
		{
			using (var con = new SqlConnection(connectionString))
			{
				return con.QueryFirst<bool>("SELECT is_read_only FROM sys.databases WHERE name='" + dbName + "'");
			}
		}

		public bool IsOrganizationDbOnline(string connectionString,string dbName)
		{
			using (var con = new SqlConnection(connectionString))
			{
				return con.QueryFirst<string>("SELECT state_desc FROM sys.databases WHERE name='" + dbName + "'").ToLower() == "online";
			}
		}

		public bool IsOrganizationDbExists(string connectionString,string dbName)
		{
			using (var con = new SqlConnection(connectionString))
			{
				var count = con.QueryFirst<int>("SELECT count(*) FROM sys.databases WHERE name='" + dbName + "'");
				return count != 0;
			}
		}

		public IEnumerable<Organizations> GetOrgByEmail(string email)
		{
			using (var con = Connection)
			{
				return con.Query<Organizations>("sp_GetOrganizationByEmail",new { Email = email },commandType: CommandType.StoredProcedure);
			}
		}

		public void SetOrganizationToNotActive(Guid orgId)
		{
			var organization = GetOrganizationStatus(orgId);
			bool status = organization.IsActive;
			var databaseName = GetDatabaseNameByOrganization(organization);

			using (var con = Connection)
			{
				if (status == true)
				{
					con.Query<Organizations>("sp_UpdateOrgToNotActive",new { OrgId = organization.OrganizationId },commandType: CommandType.StoredProcedure);
				}
				else if (status == false)

				{
					var parameter = new DynamicParameters();

					parameter.Add("@OrganizationId",orgId,dbType: DbType.Guid,direction: ParameterDirection.Input);
					parameter.Add("@DatabaseName",databaseName,dbType: DbType.String,direction: ParameterDirection.Input);

					con.Query<Organizations>("sp_DropOrganization",parameter,commandType: CommandType.StoredProcedure);
				}
			}
		}
	}
}
