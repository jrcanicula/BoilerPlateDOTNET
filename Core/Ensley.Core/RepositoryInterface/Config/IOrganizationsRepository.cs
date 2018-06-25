using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.RepositoryInterface.Config
{
    public interface IOrganizationsRepository : IDapperRepository<Organizations>
    {
        Organizations GetOrganizationByName(string name);

        void CreateOrganizationDatabase(Organizations org, string templateDbName, string dbName);     

        Organizations GetConfigOrganizationByName(string name);

        string GetConnectionStringByOrganization(IHttpContextAccessor contextAccesor);

        bool IsOrganizationDbReadOnly(string connectionString, string dbName);

        bool IsOrganizationDbOnline(string connectionString, string dbName);

        bool IsOrganizationDbExists(string connectionString, string dbName);

        IEnumerable<Organizations> GetOrgByEmail(string email);

        void SetOrganizationToNotActive(Guid orgId);
    }
}
