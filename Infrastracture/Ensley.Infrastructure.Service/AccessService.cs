using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ensley.Core.Common;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.ServiceInterface;

namespace Ensley.Infrastructure.Service
{
	public class AccessService:IAccessService
	{

		private readonly IAccessRepository _accessRepository;

		public AccessService(IAccessRepository accessRepository)
		{
			_accessRepository = accessRepository;
		}

		public IEnumerable<Access> GetAccesses()
		{
			return _accessRepository.FindAll().OrderByDescending(x => x.ModifiedOn);
		}
		public bool CreateAccess(AccessInDTO access)
		{
			try
			{
				var accessExists = _accessRepository.FindAll().Any(x => x.Name.ToLower() == access.Name.ToLower());

				if (accessExists)
				{
					return false;
				}
				var newAccess = new Access();
				newAccess.Name = access.Name;
				newAccess.Description = access.Description;
				newAccess.CreatedBy = null;
				newAccess.Category = access.Category != null ? access.Category : String.Empty;
				newAccess.CreatedOn = Localization.GetUTCDateNow();
				newAccess.AccessId = Guid.NewGuid();

				_accessRepository.Add(newAccess);
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;

		}
		public bool DeleteAccess(Guid accessId)
		{
			try
			{
				var currentAccess = _accessRepository.FindByID(accessId);

				if (currentAccess == null)
				{
					return false;
				}
				else
				{
					_accessRepository.Remove(accessId);
				}
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;
		}

		public bool UpdateAccess(AccessInDTO access)
		{
			try
			{
				var currentAccess = _accessRepository.FindByID(access.AccessId ?? Guid.Empty);

				if (currentAccess == null)
					return false;

				var accessExists = _accessRepository.FindAll().Any(x => x.Name.ToLower() == access.Name.ToLower() && access.AccessId != access.AccessId);

				if (accessExists)
					return false;

				currentAccess.Name = access.Name;
				currentAccess.Description = access.Description;
				currentAccess.CreatedBy = null;
				currentAccess.Category = access.Category != null ? access.Category : String.Empty;
				currentAccess.ModifiedOn = Localization.GetUTCDateNow();
				currentAccess.ModifiedBy = null;
				_accessRepository.Update(currentAccess);
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;
		}

		public IEnumerable<AccessMappingItemOutDTO> GetAvailableAccessMappings()
		{
			return _accessRepository.FindAll().OrderByDescending(x => x.CreatedOn).Select(x => new AccessMappingItemOutDTO { AccessId = x.AccessId,Name = x.Name,Category = x.Category });
		}

	}
}
