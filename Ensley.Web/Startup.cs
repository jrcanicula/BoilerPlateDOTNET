using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Arrow.Tools.Core.ServiceInterface;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.RepositoryInterface.Config;
using Ensley.Core.Security.Config;
using Ensley.Core.ServiceInterface;
using Ensley.Core.Utils;
using Ensley.Infrastructure.Data.Repository;
using Ensley.Infrastructure.Data.Repository.Config;
using Ensley.Infrastructure.Service;
using Ensley.Infrastructure.Service.Config;
using Ensley.Web.Filters;
using Ensley.Web.Hubs;
using Ensley.Web.Middleware;
using Rotativa.AspNetCore;
using Microsoft.AspNetCore.Identity;

namespace Ensley.Web
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc(options =>
			{
				options.Filters.Add(typeof(ValidateDataModelAttribute));
			});

			services.AddSignalR();

			ConfigureDependecy(services);
		}

		private void ConfigureDependecy(IServiceCollection services)
		{
			// If you don't want the cookie to be automatically authenticated and assigned to HttpContext.User, 
			// remove the CookieAuthenticationDefaults.AuthenticationScheme parameter passed to AddAuthentication.


			services.Configure<SecurityStampValidatorOptions>(options => options.ValidationInterval = TimeSpan.FromSeconds(10));

			services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
							.AddCookie(options =>
							{
								options.LoginPath = "/Home/LogIn";
								options.LogoutPath = "/Home/LogOff";
							}).Services.ConfigureApplicationCookie(options =>
							{
								options.SlidingExpiration = true;
								options.ExpireTimeSpan = TimeSpan.FromMinutes(2);
							});
			// aspnet
			services.AddSingleton<IHttpContextAccessor,HttpContextAccessor>();
			services.AddSingleton<IActionContextAccessor,ActionContextAccessor>();
			// repositories
			services.AddSingleton<IUserInfoRepository,UserInfoRepository>();
			services.AddSingleton<IOrganizationsRepository,OrganizationsRepository>();
			services.AddScoped<IAccessRepository,AccessRepository>();
			services.AddScoped<IRoleRepository,RoleRepository>();
			services.AddScoped<IUserRoleRepository,UserRoleRepository>();
			services.AddScoped<IRoleAccessRepository,RoleAccessRepository>();

			services.AddScoped<IConfigurationRepository,ConfigurationRepository>();
			//services
			services.AddScoped<IUserInfoService,UserInfoService>();
			// services
			services.AddScoped<IUserInfoService,UserInfoService>();
			services.AddSingleton<IOrganizationService,OrganizationsService>();
			services.AddScoped<IAccessService,AccessService>();
			services.AddScoped<IRoleService,RoleService>();

			services.AddScoped<IConfigurationService,ConfigurationService>();
			services.AddScoped<IClientService,ClientService>();

			//Azure
			services.AddScoped<IAzureService,AzureService>();

		}

		public void Configure(IApplicationBuilder app,IHostingEnvironment env)
		{
			app.UseTenantResolverMiddleware();
			app.UseAuthentication();

			if (env.IsDevelopment())
			{
				app.UseBrowserLink();
				app.UseDeveloperExceptionPage();
				Common.ConfigConnectionString = Configuration["Data:ConnectionString"];
			}
			else if (env.IsStaging())
			{
				app.UseDeveloperExceptionPage();
				Common.ConfigConnectionString = Configuration["Data:ConnectionString"];
			}
			else if (env.IsProduction())
			{
				app.UseDeveloperExceptionPage();
				Common.ConfigConnectionString = Configuration["Data:ConnectionString"];
			}


			app.UseMvc(routes =>
			{
				routes.MapRoute(
									name: "default",
									template: "{controller=Home}/{action=Index}/{id?}");
			});

			app.UseSignalR(routes =>
			{
				routes.MapHub<NotificationHub>("/notificationhub");
			});


			app.UseDefaultFiles();
			app.UseStaticFiles();

			RotativaConfiguration.Setup(env);
		}
	}
}
