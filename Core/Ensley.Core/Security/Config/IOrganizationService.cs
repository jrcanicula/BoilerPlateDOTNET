using Ensley.Core.Domain.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Security.Config
{
    public interface IOrganizationService
    {
        Organizations GetById(Guid id);

        IEnumerable<Organizations> GetAllOrganizations();

        Organizations GetOrgnizationByName(string name);  
     
        void Delete(Guid id);

        bool Validate(Organizations organization, out string message);

        IEnumerable<Organizations> GetOrgByEmail(string email);

        void SetOrganizationToNotActive(Guid orgId);   
    }
}
