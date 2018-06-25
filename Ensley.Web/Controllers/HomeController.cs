using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Arrow.Tools.Core.ServiceInterface;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Response;
using Ensley.Core.Security;
using Ensley.Core.ServiceInterface;
using Ensley.Core.Utils;
using Ensley.Web.Models;

namespace Ensley.Web.Controllers
{
	[Authorize]
	public class HomeController:Controller
	{
		private readonly IUserInfoService _userInfoService;
		private readonly IHttpContextAccessor _contextAccessor;

		private readonly IClientService _clientService;
		public HomeController(IUserInfoService userService,
	IHttpContextAccessor contextAccessor,

				IClientService clientService)
		{
			_userInfoService = userService;
			_contextAccessor = contextAccessor;
			_clientService = clientService;
		}

		public IActionResult Dashboard()
		{
			return PartialView();
		}

		public IActionResult Contracts()
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);
			var companyId = Security.GetCompanyId(identity);
			var isClient = _clientService.IsClient(companyId);

			if (_clientService.IsClient(companyId))
			{
				ViewData["IsClient"] = isClient;
				return PartialView();
			}
			else
			{
				return PartialView("VendorContracts");
			}
		}

		[AllowAnonymous]
		public IActionResult Login()
		{
			return View();
		}

		[AllowAnonymous]
		public IActionResult ChangePassword(Guid id)
		{
			//_emailService.SendEmail("raygan.lasic@accenture.com","test","test");

			return View();
		}

		[AllowAnonymous]
		[HttpPost]
		[ValidateAntiForgeryToken]
		public IActionResult Login(LoginViewModel model)
		{
			UserInfo user = null;

			if (!string.IsNullOrWhiteSpace(model.UserName) && !string.IsNullOrWhiteSpace(model.Password))
			{
				user = _userInfoService.SelectByLoginCredentials(model.UserName.Trim(),model.Password.Trim());

				//getAccessByUserId

				if (user != null)
				{
					var claims = new List<Claim>
										{
												new Claim(SystemConstant.CLAIM_EMAIL, user.Email),
												new Claim(SystemConstant.CLAIM_USERINFO_ID, user.UserInfoId.ToString()),
												new Claim (SystemConstant.CLAIM_COMPANY_ID, user.EntityId.ToString()),
					};

					var claimsIdentity = new ClaimsIdentity(claims,CookieAuthenticationDefaults.AuthenticationScheme);

					var authProperties = new AuthenticationProperties
					{
						AllowRefresh = true,
						// Refreshing the authentication session should be allowed.

						ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60),
						// The time at which the authentication ticket expires. A 
						// value set here overrides the ExpireTimeSpan option of 
						// CookieAuthenticationOptions set with AddCookie.

						IsPersistent = true,
						// Whether the authentication session is persisted across 
						// multiple requests. Required when setting the 
						// ExpireTimeSpan option of CookieAuthenticationOptions 
						// set with AddCookie. Also required when setting 
						// ExpiresUtc.

						//IssuedUtc = <DateTimeOffset>,
						// The time at which the authentication ticket was issued.

						RedirectUri = "index"
						// The full path or absolute URI to be used as an http 
						// redirect response value.
					};


					HttpContext.SignInAsync(
								 CookieAuthenticationDefaults.AuthenticationScheme,
								 new ClaimsPrincipal(claimsIdentity),
								 authProperties);
				}
				else
				{
					ViewBag.Message = "Invalid Email or Password";
				}
			}
			else
			{
				ViewBag.Message = "Invalid Email or Password";
			}
			return View();
		}

		[HttpPost]
		[HttpGet]
		[AllowAnonymous]
		public IActionResult LogOff()
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			if (identity.IsAuthenticated)
			{
				HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
			}

			return RedirectToAction("Login","Home");
		}

		[AllowAnonymous]
		public IActionResult NotAuthorize()
		{
			return View();
		}

		[AllowAnonymous]
		public IActionResult About()
		{
			ViewData["Message"] = "Your application description page.";

			return View();
		}

		[AllowAnonymous]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

		public IActionResult Profile()
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);

			ViewData["UserId"] = userInfoId;
			return View();
		}

		[ResponseCache(NoStore = true,Location = ResponseCacheLocation.None)]
		public IActionResult Index()
		{
			var identity = _contextAccessor.HttpContext.User.Identity;
			var userInfoId = Security.GetUserInfoId(identity);
			var userDetails = _userInfoService.GetUserProfile(userInfoId);

			ViewData["UserImage"] = userDetails.ImageURL != null ? userDetails.ImageURL : "";
			ViewData["Name"] = userDetails.FirstName + " " + userDetails.LastName;
			ViewData["CompanyId"] = Security.GetCompanyId(identity);

			return View();
		}

		public IActionResult UserManagement()
		{
			return View();
		}

		public IActionResult EmailManagement()
		{
			return View();
		}

		public IActionResult ProductManagement()
		{
			return View();
		}


		public IActionResult ContactManagement()
		{
			return View();
		}

		public IActionResult Documents()
		{
			return View();
		}
	}

	public class LoginViewModel
	{
		public string UserName { get; set; }
		public string Password { get; set; }
	}
}
