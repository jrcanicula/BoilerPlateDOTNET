using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ensley.Web.Middleware
{
    public static class BuilderExtensions
    {
        public static IApplicationBuilder UseTenantResolverMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<TenantResolverMiddleware>();
        }
    }
}
