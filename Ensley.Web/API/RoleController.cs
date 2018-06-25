using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using Ensley.Core.Security;
using Ensley.Core.ServiceInterface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ensley.Web.API
{
	[Authorize]
	[Route("api/[controller]")]
  public class RoleController:Controller
  {
    private readonly IUserInfoService _userService;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IRoleService _roleService;

    public RoleController(IUserInfoService userService,
            IHttpContextAccessor contextAccessor,
            IRoleService roleService)
    {
      _userService = userService;
      _contextAccessor = contextAccessor;
      _roleService = roleService;
    }

    [HttpPost]
    public JsonResult CreateRole([FromBody]RoleInDTO role)
    {

      var identity = _contextAccessor.HttpContext.User.Identity;
      var userInfoId = Security.GetUserInfoId(identity);

      if (role == null)
      {
        throw new Exception("Error");
      }

      var status = _roleService.CreateRole(role,userInfoId);
      return Json(status);
    }

    [HttpPut("{roleId}")]
    public JsonResult UpdateRole(Guid roleId,[FromBody] RoleInDTO role)
    {
      var identity = _contextAccessor.HttpContext.User.Identity;
      var userInfoId = Security.GetUserInfoId(identity);

      if (role == null || roleId == null)
      {
        throw new Exception("Error");
      }
      var status = _roleService.UpdateRole(role,userInfoId);
      return Json(status);
    }

    [HttpDelete("{roleId}")]
    public JsonResult DeleteRole(Guid roleId)
    {
      if (roleId == null)
      {
        throw new Exception("Error");
      }
      var status = _roleService.DeleteRole(roleId);
      return Json(status);
    }

    [HttpGet("list")]
    public JsonResult GetRoles()
    {
      var result = _roleService.GetRoles();
      return Json(result);
    }

    [HttpGet("availableMappingList")]
    public JsonResult GetAvailableRolesMapping()
    {
      var result = _roleService.GetAvailableRoleMappings();
      return Json(result);
    }

    [HttpGet("mapped/{roleId}")]
    public JsonResult GetMappedRoles(Guid roleId)
    {
      if (roleId == null)
      {
        throw new Exception("Something is missing in the payload or Id");
      }
      var result = _roleService.GetMappedAccess(roleId);
      return Json(result);
    }

    [HttpGet("unmapped/{roleId}")]
    public JsonResult GetUnmappedRoles(Guid roleId)
    {
      if (roleId == null)
      {
        throw new Exception("Something is missing in the payload or Id");
      }
      var result = _roleService.GetUnmappedAccess(roleId);
      return Json(result);
    }

  }
}
