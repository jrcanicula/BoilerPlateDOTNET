using Ensley.Core.Domain;
using Ensley.Core.DTO.Generic;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.ServiceInterface
{
	public interface IUserInfoService
	{
		UserInfo GetUserInfoById(Guid id);
		UserInfoDTO SelectByLoginCredentials(string username,string password);
		IEnumerable<UserInfo> GetAllUserInformations();
		bool CreateUser(UserInfoManagementInDTO user,Guid userInfoId,string imageURL);
		bool DeleteUser(Guid userInfoId);
		bool UpdatePassword(UserInfoUpdatePasswordInDTO userPasswordUpdate);
		bool UpdateUser(UserInfoManagementInDTO user,Guid userInfoId);
		IEnumerable<RoleMappingItemOutDTO> GetUnmappedRoles(Guid userInfoId);
		IEnumerable<RoleMappingItemOutDTO> GetMappedRoles(Guid userInfoId);
		UserProfileOutDTO GetUserProfile(Guid userInfoId);
		bool UpdateUserProfile(UserGeneralProfileInDTO user,Guid userInfoId);
		IEnumerable<UserInfoFullNameDTO> GetCompanyUsers(Guid companyId);
		Guid GetUserEntityId(Guid userInfoId);
		string GetUserFullName(Guid userInfoId);
	}
}
