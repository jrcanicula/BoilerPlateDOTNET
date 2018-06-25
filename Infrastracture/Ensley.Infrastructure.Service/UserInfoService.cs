using Ensley.Core.Common;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Generic;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.Security;
using Ensley.Core.ServiceInterface;
using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Service
{
	public class UserInfoService:IUserInfoService
	{
		private readonly IUserInfoRepository _userInfoRepository;
		private readonly IUserRoleRepository _userRoleRepository;
		public UserInfoService(IUserInfoRepository userInfoRepository,IUserRoleRepository userRoleRepository)
		{
			_userInfoRepository = userInfoRepository;
			_userRoleRepository = userRoleRepository;
		}

		public UserInfo GetUserInfoById(Guid id)
		{
			return _userInfoRepository.SelectById(id);
		}

		public Guid GetUserEntityId(Guid userInfoId)
		{
			var user = _userInfoRepository.FindByID(userInfoId);

			if (user == null)
			{
				throw new Exception("User does not exist");
			}
			return user.EntityId ?? Guid.Empty;
		}

		public string GetUserFullName(Guid userInfoId)
		{
			var user = _userInfoRepository.FindByID(userInfoId);

			if (user == null)
			{
				throw new Exception("User does not exist");
			}
			return user.FirstName + " " + user.LastName;
		}

		public UserInfoDTO SelectByLoginCredentials(string username,string password)
		{
			var encrypted = Security.HashPassword(password);
			var userInfo = _userInfoRepository.SelectByLoginCredentials(username,encrypted);

			if (userInfo != null)
			{
				_userInfoRepository.GetUserAccess(userInfo.UserInfoId);
			}

			return userInfo;
		}

		public IEnumerable<UserInfo> GetAllUserInformations()
		{
			return _userInfoRepository.FindAll().OrderByDescending(x => x.ModifiedOn);
		}

		public IEnumerable<RoleMappingItemOutDTO> GetMappedRoles(Guid userInfoId)
		{
			return _userInfoRepository.GetMappedRoles(userInfoId);
		}

		public IEnumerable<RoleMappingItemOutDTO> GetUnmappedRoles(Guid userInfoId)
		{
			return _userInfoRepository.GetUnmappedRoles(userInfoId);
		}

		public bool CreateUser(UserInfoManagementInDTO user,Guid userInfoId,string imageURL)
		{
			try
			{
				if (ValidateEmail(user.Email) != Guid.Empty)
				{
					return false;
				}

				var userInfo = new UserInfo();
				userInfo.Address = user.Address;
				userInfo.EntityId = user.CompanyId;
				userInfo.ContactNo = user.ContactNo;
				userInfo.Country = user.Country;
				userInfo.Email = user.Email;
				userInfo.FirstName = user.FirstName;
				userInfo.LastName = user.LastName;
				userInfo.Position = user.Position;
				userInfo.Status = user.Status;
				userInfo.Timezone = user.Timezone;
				userInfo.CreatedBy = userInfoId;
				userInfo.ModifiedBy = userInfoId;
				userInfo.ModifiedOn = Localization.GetUTCDateNow();
				userInfo.CreatedOn = Localization.GetUTCDateNow();
				userInfo.UserInfoId = Guid.NewGuid();
				userInfo.ImageURL = imageURL;

				var userId = _userInfoRepository.Add(userInfo);

				foreach (var mappedRole in user.RoleMappingItems)
				{
					var userRole = new UserRole();
					userRole.UserId = userId;
					userRole.RoleId = mappedRole.RoleId;
					userRole.CreatedBy = userInfoId;
					userRole.CreatedOn = Localization.GetUTCDateNow();
					userRole.ModifiedBy = userInfoId;
					userRole.ModifiedOn = Localization.GetUTCDateNow();
					_userRoleRepository.Add(userRole,true);
				}
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;
		}

		public bool UpdateUser(UserInfoManagementInDTO user,Guid userInfoId)
		{
			try
			{
				var currentUser = _userInfoRepository.FindByID(user.UserInfoId ?? Guid.Empty);

				if (currentUser == null)
					return false;

				var emailExists = _userInfoRepository.FindAll().Any(x => x.Email.ToLower() == user.Email.ToLower() && user.UserInfoId != currentUser.UserInfoId);

				if (emailExists)
				{
					return false;
				}

				currentUser.Address = user.Address;
				currentUser.EntityId = user.CompanyId;
				currentUser.ContactNo = user.ContactNo;
				currentUser.Country = user.Country;
				currentUser.Email = user.Email;
				currentUser.FirstName = user.FirstName;
				currentUser.LastName = user.LastName;
				currentUser.Position = user.Position;
				currentUser.Status = user.Status;
				currentUser.Timezone = user.Timezone;
				currentUser.ModifiedOn = Localization.GetUTCDateNow();
				currentUser.ModifiedBy = userInfoId;
				_userInfoRepository.Update(currentUser);


				var exisitingMappedRoles = _userRoleRepository.FindAll().Where(x => x.UserId == currentUser.UserInfoId);

				foreach (var existingMappedRole in exisitingMappedRoles)
				{
					_userRoleRepository.Remove(existingMappedRole.UserRoleId);
				}

				foreach (var mappedRole in user.RoleMappingItems)
				{
					var userRole = new UserRole();
					userRole.UserId = currentUser.UserInfoId;
					userRole.RoleId = mappedRole.RoleId;
					userRole.CreatedBy = userInfoId;
					userRole.CreatedOn = Localization.GetUTCDateNow();
					userRole.ModifiedBy = userInfoId;
					userRole.ModifiedOn = Localization.GetUTCDateNow();
					_userRoleRepository.Add(userRole,true);
				}
			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;
		}

		public bool DeleteUser(Guid userInfoId)
		{

			if (userInfoId == Guid.Parse(SystemConstant.SUPER_ADMINISTRATOR_USERINFOID.ToString().ToLower()))
			{
				return false;
			}

			try
			{
				var currentUser = _userInfoRepository.FindByID(userInfoId);

				if (currentUser == null)
				{
					return false;
				}
				else
				{
					_userInfoRepository.Remove(userInfoId);
				}
			}
			catch (Exception ex)
			{

				throw new Exception(ex.Message);
			}
			return true;
		}
		private Guid ValidateEmail(string email)
		{
			if (_userInfoRepository.FindAll().Any(x => x.Email == email))
			{
				return _userInfoRepository.FindAll().SingleOrDefault(p => p.Email == email).UserInfoId;
			}
			return Guid.Empty;
		}

		public UserProfileOutDTO GetUserProfile(Guid userInfoId)
		{
			return _userInfoRepository.GetUserProfile(userInfoId);
		}

		public bool UpdateUserProfile(UserGeneralProfileInDTO user,Guid userInfoId)
		{
			try
			{
				var currentUser = _userInfoRepository.FindByID(user.UserInfoId);

				if (currentUser == null)
					return false;

				currentUser.Address = user.Address;
				currentUser.ContactNo = user.ContactNo;
				currentUser.Position = user.Position;
				currentUser.ImageURL = user.ImageURL;
				currentUser.ModifiedOn = Localization.GetUTCDateNow();
				currentUser.ModifiedBy = userInfoId;
				currentUser.Country = user.Country;
				_userInfoRepository.Update(currentUser);

			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;
		}

		public bool UpdatePassword(UserInfoUpdatePasswordInDTO userPasswordUpdate)
		{
			try
			{
				var currentUser = _userInfoRepository.FindByID(userPasswordUpdate.UserInfoId);

				if (currentUser == null)
				{
					return false;
				}

				currentUser.Password = Security.HashPassword(userPasswordUpdate.Password);
				currentUser.ModifiedOn = Localization.GetUTCDateNow();
				currentUser.ModifiedBy = userPasswordUpdate.UserInfoId;
				_userInfoRepository.Update(currentUser);

			}
			catch (Exception ex)
			{
				throw new Exception(ex.Message);
			}
			return true;
		}

		public IEnumerable<UserInfoFullNameDTO> GetCompanyUsers(Guid companyId)
		{
			var result = _userInfoRepository.FindAll().Where(x => x.EntityId == companyId).Select(x => new UserInfoFullNameDTO() { FullName = x.FirstName + " " + x.LastName,UserInfoId = x.UserInfoId });
			if (result == null)
			{
				throw new Exception("There's an error with the input");
			}
			return result;
		}
	}
}
