using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ensley.Core.Common;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.ServiceInterface;

namespace Ensley.Infrastructure.Service
{
  public class RoleService:IRoleService
  {
    private readonly IRoleRepository _roleRepository;
    private readonly IRoleAccessRepository _roleAccessRepository;
    public RoleService(IRoleRepository roleRepository,IRoleAccessRepository roleAccessRepository)
    {
      _roleRepository = roleRepository;
      _roleAccessRepository = roleAccessRepository;
    }
    public IEnumerable<Role> GetRoles()
    {
      return _roleRepository.FindAll().OrderByDescending(x => x.ModifiedOn);
    }
    public bool CreateRole(RoleInDTO role,Guid userInfoId)
    {
      try
      {
        var roleExists = _roleRepository.FindAll().Any(x => x.Name.ToLower() == role.Name.ToLower());

        if (roleExists)
        {
          return false;
        }

        var newRole = new Role();
        newRole.Name = role.Name;
        newRole.Description = role.Description;
        newRole.Status = role.Status;
        newRole.CreatedOn = Localization.GetUTCDateNow();
        newRole.CreatedBy = userInfoId;
        newRole.ModifiedBy = userInfoId;
        newRole.ModifiedOn = Localization.GetUTCDateNow();
        newRole.RoleId = Guid.NewGuid();

        var roleId = _roleRepository.Add(newRole);

        foreach (var mappedRole in role.AccessMappingItems)
        {
          var roleAccess = new RoleAccess();
          roleAccess.AccessId = mappedRole.AccessId;
          roleAccess.RoleId = roleId;
          roleAccess.CreatedBy = userInfoId;
          roleAccess.CreatedOn = Localization.GetUTCDateNow();
          roleAccess.ModifiedBy = userInfoId;
          roleAccess.ModifiedOn = Localization.GetUTCDateNow();
          _roleAccessRepository.Add(roleAccess,true);
        }

      } catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }

      return true;
    }
    public bool DeleteRole(Guid roleId)
    {
      try
      {
        var currentRole = _roleRepository.FindByID(roleId);

        if (currentRole == null)
        {
          return false;
        } 
        else
        {
          _roleRepository.Remove(roleId);
        }
      } catch (Exception ex)
      {

        throw new Exception(ex.Message);
      }
      return true;
    }
    public bool UpdateRole(RoleInDTO role,Guid userInfoId)
    {
      try
      {
        var curentRole = _roleRepository.FindByID(role.RoleId ?? Guid.Empty);

        if (curentRole == null)
        {
          return false;
        }
        var roleExists = _roleRepository.FindAll().Any(x => x.Name.ToLower() == role.Name.ToLower() && role.RoleId != role.RoleId);

        if (roleExists)
        {
          return false;
        }

        curentRole.Name = role.Name;
        curentRole.Description = role.Description;
        curentRole.Status = role.Status;
        curentRole.ModifiedBy = userInfoId;
        curentRole.ModifiedOn = Localization.GetUTCDateNow();
        _roleRepository.Update(curentRole);

        var exisitingMappedAccessList = _roleAccessRepository.FindAll().Where(x => x.RoleId == curentRole.RoleId);

        foreach (var exisitingMappedAccess in exisitingMappedAccessList)
        {
          _roleAccessRepository.Remove(exisitingMappedAccess.RoleAccessId);
        }

        foreach (var mappedRole in role.AccessMappingItems)
        {
          var roleAccess = new RoleAccess();
          roleAccess.AccessId = mappedRole.AccessId;
          roleAccess.RoleId = curentRole.RoleId;
          _roleAccessRepository.Add(roleAccess,true);
        }
      } 
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }
      return true;
    }
    public IEnumerable<RoleMappingItemOutDTO> GetAvailableRoleMappings()
    {
      return _roleRepository.FindAll().Select(x => new RoleMappingItemOutDTO { Name = x.Name,RoleId = x.RoleId });
    }
    public IEnumerable<AccessMappingItemOutDTO> GetUnmappedAccess(Guid roleId)
    {
      return _roleRepository.GetUnmappedAccess(roleId);
    }
    public IEnumerable<AccessMappingItemOutDTO> GetMappedAccess(Guid roleId)
    {
      return _roleRepository.GetMappedAccess(roleId);
    }
  }
}
