using Dapper;
using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Response;
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
  public class RoleRepository:DapperRepository<Role>, IRoleRepository
  {
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IOrganizationsRepository _organizationsRepository;
    public RoleRepository(IHttpContextAccessor contextAccessor,IOrganizationsRepository organizationsRepository)
        : base("Role",contextAccessor,organizationsRepository)
    {
      _contextAccessor = contextAccessor;
      _organizationsRepository = organizationsRepository;
    }
    public IEnumerable<AccessMappingItemOutDTO> GetUnmappedAccess(Guid roleId)
    {
      using (IDbConnection con = Connection)
      {
        var param = new { RoleId = roleId };
        var data = con.Query<AccessMappingItemOutDTO>("sp_GetUnmappedAccess",param,commandType: CommandType.StoredProcedure);
        return data;
      }
    }
    public IEnumerable<AccessMappingItemOutDTO> GetMappedAccess(Guid roleId)
    {
      using (IDbConnection con = Connection)
      {
        var param = new { RoleId = roleId };
        var data = con.Query<AccessMappingItemOutDTO>("sp_GetMappedAccess",param,commandType: CommandType.StoredProcedure);
        return data;
      }
    }
  }
}
