using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ensley.Core.Domain;
using Ensley.Core.ServiceInterface;
using Ensley.Core.Utils;

namespace Ensley.Web.Controllers
{
  [Route("api/[controller]")]
  [Authorize]
  public class AuthenticationController:Controller
  {
    private readonly IUserInfoService _userService;

    public AuthenticationController(IUserInfoService userService)
    {
      _userService = userService;
    }

    [AllowAnonymous]
    public async Task<ActionResult> Authenticate(string email,string password)
    {
      UserInfo user = null;

      if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(password))
      {
        user = _userService.SelectByLoginCredentials(email.Trim(),password.Trim());

        if (user != null)
        {
          var claims = new List<Claim>
                    {
                        new Claim(SystemConstant.CLAIM_EMAIL, user.Email),
                        new Claim(SystemConstant.CLAIM_USERINFO_ID, user.UserInfoId.ToString()),
                        //new Claim(SystemConstant.CLAIM_TIMEZONE, user.TimeZoneId.ToString()),
                    };

          var claimsIdentity = new ClaimsIdentity(claims,CookieAuthenticationDefaults.AuthenticationScheme);

          var authProperties = new AuthenticationProperties {
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

            RedirectUri = "#dashboard"
            // The full path or absolute URI to be used as an http 
            // redirect response value.
          };


          await HttpContext.SignInAsync(
                  CookieAuthenticationDefaults.AuthenticationScheme,
                  new ClaimsPrincipal(claimsIdentity),
                  authProperties);
        }
      }

      return Json(user);
    }

    [AllowAnonymous]
    [Route("logoff")]
    public async Task<ActionResult> LogOff()
    {
      await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
      return null;
    }
  }
}
