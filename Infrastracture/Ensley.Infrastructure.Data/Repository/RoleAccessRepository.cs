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
  public class RoleAccessRepository:DapperRepository<RoleAccess>, IRoleAccessRepository
  {
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IOrganizationsRepository _organizationsRepository;

    public RoleAccessRepository(IHttpContextAccessor contextAccessor,IOrganizationsRepository organizationsRepository)
        : base("RoleAccess",contextAccessor,organizationsRepository)
    {
      _contextAccessor = contextAccessor;
      _organizationsRepository = organizationsRepository;
    }
  }
}
