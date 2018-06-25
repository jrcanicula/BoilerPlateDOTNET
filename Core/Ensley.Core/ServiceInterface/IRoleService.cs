using Ensley.Core.Domain;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.ServiceInterface
{
  public interface IRoleService
  {
    IEnumerable<Role> GetRoles();

    bool CreateRole(RoleInDTO role,Guid userInfoId);

    bool DeleteRole(Guid roleId);

    bool UpdateRole(RoleInDTO role,Guid userInfoId);

    IEnumerable<RoleMappingItemOutDTO> GetAvailableRoleMappings();

    IEnumerable<AccessMappingItemOutDTO> GetUnmappedAccess(Guid roleId);

    IEnumerable<AccessMappingItemOutDTO> GetMappedAccess(Guid roleId);
  }
}
