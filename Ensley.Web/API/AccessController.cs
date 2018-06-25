using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ensley.Core.DTO.Request;
using Ensley.Core.Security;
using Ensley.Core.ServiceInterface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ensley.Web.API
{
	[Authorize]
	[Route("api/[controller]")]
	public class AccessController:Controller
	{
		private readonly IUserInfoService _userService;
		private readonly IHttpContextAccessor _contextAccessor;
		private readonly IAccessService _accessService;
		public AccessController(IUserInfoService userService,
						IHttpContextAccessor contextAccessor,
						IAccessService accessService)
		{
			_userService = userService;
			_contextAccessor = contextAccessor;
			_accessService = accessService;
		}

		[HttpGet("list")]
		public JsonResult GetAccesses()
		{
			var result = _accessService.GetAccesses().OrderByDescending(x => x.ModifiedOn);
			return Json(result);
		}

		[HttpPost]
		public JsonResult CreateAccess([FromBody]AccessInDTO access)
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (access == null)
			{
				throw new Exception("Error");
			}
			var status = _accessService.CreateAccess(access);
			return Json(status);
		}

		[HttpPut("{accessId}")]
		public JsonResult UpdateAccess(Guid accessId,[FromBody] AccessInDTO access)
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (access == null || accessId == null)
			{
				throw new Exception("Error");
			}
			var status = _accessService.UpdateAccess(access);
			return Json(status);
		}

		[HttpDelete("{accessId}")]
		public JsonResult DeleteAccess(Guid accessId)
		{
			if (accessId == null)
			{
				throw new Exception("Error");
			}
			var status = _accessService.DeleteAccess(accessId);
			return Json(status);
		}

		[HttpGet("availableMappingList")]
		public JsonResult GetAvailableAccessMapping()
		{
			var result = _accessService.GetAvailableAccessMappings();
			return Json(result);
		}
	}
}
