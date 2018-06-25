using Ensley.Core.Domain;
using Ensley.Core.Domain.Config;
using Ensley.Core.RepositoryInterface.Config;
using Ensley.Core.Security.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Service.Config
{
    public class OrganizationsService : IOrganizationService
    {
        private readonly IOrganizationsRepository _organizationsRepository;     

        public OrganizationsService(IOrganizationsRepository organizationsRepository)
        {
            _organizationsRepository = organizationsRepository;         
        }

        public Organizations GetById(Guid id)
        {
            return _organizationsRepository.FindByID(id);
        }

        public void Delete(Guid id)
        {
            _organizationsRepository.Remove(id);
        }

        public IEnumerable<Organizations> GetAllOrganizations()
        {
            return _organizationsRepository.FindAll();            
        }

        public Organizations GetOrgnizationByName(string name)
        {
            return _organizationsRepository.GetOrganizationByName(name);
        }

        public void Update(Organizations organization, string connectionString, Guid userinfoId, string toolIds)
        {
            _organizationsRepository.Update(organization);         
        }

        public bool Validate(Organizations organization, out string message)
        {
            message = String.Empty;

            if (_organizationsRepository.FindAll().Any(x => x.FriendlyName == organization.FriendlyName && (organization.OrganizationId != x.OrganizationId || organization.OrganizationId == Guid.Empty)))
            {
                message = "FriendlyName is already exist.";
                return false;
            }

            return true;
        }

        public IEnumerable<Organizations> GetOrgByEmail(string email)
        {
            return _organizationsRepository.GetOrgByEmail(email);
        }

        public void SetOrganizationToNotActive(Guid orgId)
        {
            _organizationsRepository.SetOrganizationToNotActive(orgId);
        }
    }
}
