using Ensley.Core.Domain;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Service
{
	public class ConfigurationService : IConfigurationService
	{
		private readonly IConfigurationRepository _configurationRepository;
		public ConfigurationService(IConfigurationRepository configurationRepository)
		{
			_configurationRepository = configurationRepository;

		}
		public IEnumerable<Configuration> SelectAll()
		{
			var configurations = _configurationRepository.FindAll();

			if (configurations == null) return null;

			return configurations;
		}
	}
}
