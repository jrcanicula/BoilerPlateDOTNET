using Dapper;
using Microsoft.AspNetCore.Http;
using Ensley.Core.Domain;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using Ensley.Core.RepositoryInterface;
using Ensley.Core.RepositoryInterface.Config;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Infrastructure.Data.Repository
{
	public class UserInfoRepository:DapperRepository<UserInfo>, IUserInfoRepository
	{
		public UserInfoRepository(IHttpContextAccessor contextAccessor,IOrganizationsRepository orgRepository)
		 : base("UserInfo",contextAccessor,orgRepository)
		{
		}
		public UserInfo SelectById(Guid id)
		{
			return FindByID(id);
		}
		public UserInfoDTO SelectByLoginCredentials(string username,string password)
		{
			using (IDbConnection con = Connection)
			{
				var param = new { UserName = username,Password = password };
				var data = con.Query<UserInfoDTO>("sp_GetUserByCredentials",param,commandType: CommandType.StoredProcedure);
				return data.FirstOrDefault();
			}
		}

		public IEnumerable<AccessOutDTO> GetUserAccess(Guid userInfoId)
		{
			using (IDbConnection con = Connection)
			{
				var param = new { UserInfoId = userInfoId };
				var data = con.Query<AccessOutDTO>("sp_GetUserAccess",param,commandType: CommandType.StoredProcedure);
				return data;
			}
		}

		public IEnumerable<RoleMappingItemOutDTO> GetMappedRoles(Guid userInfoId)
		{
			using (IDbConnection con = Connection)
			{
				var param = new { UserInfoId = userInfoId };
				var data = con.Query<RoleMappingItemOutDTO>("sp_GetMappedRoles",param,commandType: CommandType.StoredProcedure);
				return data;
			}
		}

		public IEnumerable<RoleMappingItemOutDTO> GetUnmappedRoles(Guid userInfoId)
		{
			using (IDbConnection con = Connection)
			{
				var param = new { UserInfoId = userInfoId };
				var data = con.Query<RoleMappingItemOutDTO>("sp_GetUnmappedRoles",param,commandType: CommandType.StoredProcedure);
				return data;
			}
		}

		public UserProfileOutDTO GetUserProfile(Guid userInfoId)
		{
			using (IDbConnection con = Connection)
			{
				var param = new { UserInfoId = userInfoId };
				var data = con.Query<UserProfileOutDTO>("sp_GetUserProfile",param,commandType: CommandType.StoredProcedure).FirstOrDefault();
				return data;
			}
		}

		public IEnumerable<UserContactInfoOutDTO> GetUserInfoByName()
		{
			using (IDbConnection con = Connection)
			{
				var data = con.Query<UserContactInfoOutDTO>("sp_GetUserContactInfo",commandType: CommandType.StoredProcedure);
				return data.ToList();
			}
		}
	}
}
