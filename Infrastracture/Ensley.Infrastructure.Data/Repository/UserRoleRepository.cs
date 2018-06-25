using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.RepositoryInterface.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Data.Repository
{
  public class UserRoleRepository:DapperRepository<UserRole>, IUserRoleRepository
  {
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IOrganizationsRepository _organizationsRepository;
    public UserRoleRepository(IHttpContextAccessor contextAccessor,IOrganizationsRepository organizationsRepository)
        : base("[dbo].UserRole",contextAccessor,organizationsRepository)
    {
      _contextAccessor = contextAccessor;
      _organizationsRepository = organizationsRepository;
    }
  }
}
