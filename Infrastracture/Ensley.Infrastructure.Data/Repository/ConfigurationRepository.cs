using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.RepositoryInterface.Config;
using Ensley.Infrastructure.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Data.Repository
{
	public class ConfigurationRepository:DapperRepository<Configuration>, IConfigurationRepository
	{
		private readonly IHttpContextAccessor _contextAccessor;
		private readonly IOrganizationsRepository _organizationsRepository;

		public ConfigurationRepository(IHttpContextAccessor contextAccessor,IOrganizationsRepository organizationsRepository)
				: base("Configuration",contextAccessor,organizationsRepository)
		{
			_contextAccessor = contextAccessor;
			_organizationsRepository = organizationsRepository;
		}
	}
}
