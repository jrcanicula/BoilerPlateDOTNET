using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain.Config;
using Ensley.Core.Security.Config;
using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ensley.Web.Middleware
{
  public class TenantResolverMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IOrganizationService _organizationService;

    public TenantResolverMiddleware(RequestDelegate next, IOrganizationService organizationService)
    {
      _organizationService = organizationService;
      _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
      await _next(context);

      // 1 - check the subdomain  
      string subdomain = Common.GetSubDomainByContextRequest(context);

      // if no found use the demo
      if (string.IsNullOrWhiteSpace(subdomain))
      {
        subdomain = "demo";
      }

      // 2 - and validate in the config  then apply to connectionstring  
      // todo caching of list of org and checking if you have
      Organizations conn = _organizationService.GetOrgnizationByName(subdomain);
      //Common.ConfigConnectionString = conn.ConnectionString;

    }
  }
}
