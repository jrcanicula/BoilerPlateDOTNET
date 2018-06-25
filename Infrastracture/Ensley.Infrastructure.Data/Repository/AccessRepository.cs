using Dapper;
using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.RepositoryInterface.Config;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Data.Repository
{
  public class AccessRepository:DapperRepository<Access>, IAccessRepository
  {
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IOrganizationsRepository _organizationsRepository;
    
    public AccessRepository(IHttpContextAccessor contextAccessor,IOrganizationsRepository organizationsRepository)
        : base("Access",contextAccessor,organizationsRepository)
    {
      _contextAccessor = contextAccessor;
      _organizationsRepository = organizationsRepository;
    }
  }
}
