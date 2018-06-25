using Ensley.Core.Domain;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.RepositoryInterface
{
	public interface IUserInfoRepository:IDapperRepository<UserInfo>
	{
		UserInfo SelectById(Guid id);
		UserInfoDTO SelectByLoginCredentials(string username,string password);

		IEnumerable<RoleMappingItemOutDTO> GetMappedRoles(Guid userInfoId);

		IEnumerable<RoleMappingItemOutDTO> GetUnmappedRoles(Guid userInfoId);

		UserProfileOutDTO GetUserProfile(Guid userInfoId);

		IEnumerable<UserContactInfoOutDTO> GetUserInfoByName();
		IEnumerable<AccessOutDTO> GetUserAccess(Guid userInfoId);

		}
}
