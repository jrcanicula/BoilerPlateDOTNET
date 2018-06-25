using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ensley.Core.Common;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Generic;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.ServiceInterface;

namespace Ensley.Infrastructure.Service
{
	public class ClientService:IClientService
	{

		private readonly IUserInfoRepository _userInfoRepository;
		public ClientService(
			IUserInfoRepository userInfoRepository)
		{
			_userInfoRepository = userInfoRepository;

		}
		public bool IsClient(Guid vendorId)
		{
			return false;
		}
	}
}
