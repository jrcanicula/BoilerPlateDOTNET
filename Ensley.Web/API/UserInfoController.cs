using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Arrow.Tools.Core.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ensley.Core.Common;
using Ensley.Core.DTO.Request;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.Security;
using Ensley.Core.ServiceInterface;
using Ensley.Core.Utils;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ensley.Web.API
{

	[Route("api/[controller]")]
    [Authorize]
    public class UserInfoController:Controller
	{
		private readonly IUserInfoService _userService;
		private readonly IHttpContextAccessor _contextAccessor;
		private readonly IUserInfoService _userInfoService;
		private readonly IAzureService _azureService;
		private readonly IUserInfoRepository _userInfoRepository;
		public UserInfoController(IUserInfoService userService,
				IHttpContextAccessor contextAccessor,
				IUserInfoService userInfoService,
				IAzureService azureService,
										IUserInfoRepository userInfoRepository)
		{
			_userService = userService;
			_contextAccessor = contextAccessor;
			_userInfoService = userInfoService;
			_azureService = azureService;
			_userInfoRepository = userInfoRepository;

		}
		
		[HttpPost]
		public async Task<JsonResult> CreateUser([FromBody]UserInfoManagementInDTO user)
		{

			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (user == null)
			{
				throw new Exception("Error");
			}

			var organizationName = Common.GetSubDomainByContextRequest(_contextAccessor.HttpContext);

			var defaultImageURL = await _azureService.SetProfileImageToDefault(Guid.NewGuid(),organizationName);

			var status = _userInfoService.CreateUser(user,userInfoId,defaultImageURL);
			return Json(status);
		}
        		
		[HttpPut("{userId}")]
		public JsonResult UpdateUser(Guid userId,[FromBody] UserInfoManagementInDTO user)
		{
            var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (user == null || userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}

			var status = _userInfoService.UpdateUser(user,userInfoId);
			return Json(status);
		}

		[HttpDelete("{userId}")]
		public JsonResult DeleteUser(Guid userId)
		{
			if (userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}

			var status = _userInfoService.DeleteUser(userId);
			return Json(status);
		}
		
		[HttpGet("list")]
		public JsonResult GetAllUserInformations()
		{

			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			var result = _userInfoService.GetAllUserInformations();

			if (!(userInfoId == Guid.Parse(SystemConstant.SUPER_ADMINISTRATOR_USERINFOID.ToString().ToLower())))
			{
				result = result.Where(x => x.UserInfoId != Guid.Parse(SystemConstant.SUPER_ADMINISTRATOR_USERINFOID.ToString().ToLower()));
			}

			return Json(result);
		}
		
		[HttpGet("mapped/{userId}")]
		public JsonResult GetMappedRoles(Guid userId)
		{
			if (userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}
			var result = _userInfoService.GetMappedRoles(userId);
			return Json(result);
		}


		[HttpGet("unmapped/{userId}")]
		public JsonResult GetUnmappedRoles(Guid userId)
		{
			if (userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}
			var result = _userInfoService.GetUnmappedRoles(userId);
			return Json(result);
		}

		
		[HttpGet("{userId}")]
		public JsonResult GetUserByUserInfoId(Guid userId)
		{
			if (userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}
			var result = _userInfoService.GetUserInfoById(userId);
			return Json(result);
		}
		
		[HttpGet("profile/{userId}")]
		public JsonResult GetUserProfile(Guid userId)
		{
			if (userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}
			var result = _userInfoService.GetUserProfile(userId);
			return Json(result);
		}
		
		[HttpPut("updatePassword/{userId}")]
		public JsonResult UpdateUserPassword(Guid userId,[FromBody] UserInfoUpdatePasswordInDTO userPasswordUpdate)
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (userPasswordUpdate == null || userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}

			var result = _userInfoService.UpdatePassword(userPasswordUpdate);
			return new JsonResult(result);
		}
        	
		[HttpPut("updateProfile/{userId}")]
		public async Task<JsonResult> UpdateUserProfile(Guid userId,[FromBody] UserGeneralProfileInDTO userProfile)
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (userProfile == null || userId == null)
			{
				throw new Exception("Something is missing in the payload or Id");
			}

			return await UpdateUserProfile(userProfile,userId);
		}
	
		private async Task<JsonResult> UpdateUserProfile(UserGeneralProfileInDTO userProfile,Guid userId)
		{
			var imageUrl = string.Empty;
			var user = (ClaimsIdentity)User.Identity;

			var organizationName = Common.GetSubDomainByContextRequest(_contextAccessor.HttpContext);

			if (!string.IsNullOrEmpty(userProfile.ImageURL) && userProfile.ImageURL.Split(',').Length > 1)
			{
				var imageContentType = userProfile.ImageURL.Split(',')[0].Split(';')[0].Split(':')[1];
				var imageFormat = (imageContentType.Split('/')[1]);
				if (!imageFormat.Equals("jpg") &&
						!imageFormat.Equals("jpeg") &&
						!imageFormat.Equals("gif") &&
						!imageFormat.Equals("png"))
				{
					return Json(new { success = "false",message = "Invalid image format. It must be jpg, jpeg, gif or png format." });
				}

				userProfile.ImageURL = userProfile.ImageURL.Replace(" ","+");

				var imageBlob = Convert.FromBase64String(userProfile.ImageURL.Split(',')[1]);

				if (imageBlob.Length > 1000000)
				{
					return Json(new { success = "false",message = "Image file size is exceeded to 1MB." });
				}

				imageUrl = _azureService.UploadProfileImage(imageBlob,String.Format("{0}.{1}",userProfile.UserInfoId,"png"),organizationName);
			}
			else
			{
				imageUrl = (userProfile.ImageURL ?? string.Empty).Split('?').First();
			}

			//imageUrl = Common.AddTimestampToLink(imageUrl,Localization.GetUTCDateNow());
			userProfile.ImageURL = imageUrl;

			if (!string.IsNullOrEmpty(imageUrl))
			{
				imageUrl = String.Format("{0}?v={1}",imageUrl,Localization.GetUTCDateNow().ToString("yyyyMMddHHmmssffff"));
				userProfile.ImageURL = imageUrl;
			}

			try
			{
				_userService.UpdateUserProfile(userProfile,userId);
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return Json(new { success = "true",newImageUrl = imageUrl });
		}
		
		[HttpGet("GetUserInfoByName")]
		public JsonResult GetUserInfoByName()
		{
			try
			{
				var name = _userInfoRepository.GetUserInfoByName();

				return Json(name);
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
		}
	}
}
