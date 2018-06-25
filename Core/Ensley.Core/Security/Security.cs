using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Security
{
	public class Security
	{
		public static ClaimsIdentity GetClaims(IIdentity userIdentity)
		{
			var user = (ClaimsIdentity)userIdentity;
			return user;
		}

		public static string GetTimeZone(IIdentity userIdentity)
		{
			var timezone = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_TIMEZONE)
						.Select(c => c.Value).SingleOrDefault();

			return timezone;
		}

		public static Guid GetOrganizationId(IIdentity userIdentity)
		{
			Guid userOrgId = Guid.Empty;

			var userClaim = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_ORGANIZATION_ID)
						.Select(c => c.Value).SingleOrDefault();

			Guid.TryParse(userClaim,out userOrgId);

			return userOrgId;
		}


		public static Guid GetUserInfoId(IIdentity userIdentity)
		{
			Guid userInfoId = Guid.Empty;

			var userClaim = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_USERINFO_ID)
						.Select(c => c.Value).SingleOrDefault();

			Guid.TryParse(userClaim,out userInfoId);


			return userInfoId;
		}

		public static string GetEmail(IIdentity userIdentity)
		{
			var userClaim = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_EMAIL)
						.Select(c => c.Value).SingleOrDefault();

			return userClaim;
		}

		public static Guid GetCompanyId(IIdentity userIdentity)
		{

			Guid companyId = Guid.Empty;

			var userClaim = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_COMPANY_ID)
						.Select(c => c.Value).SingleOrDefault();

			Guid.TryParse(userClaim,out companyId);

			return companyId;
		}

		public static string GetUserName(IIdentity userIdentity)
		{
			string userName = string.Empty;
			userName = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_USERNAME)
						.Select(c => c.Value).SingleOrDefault();

			return userName;
		}

		public static string HashPassword(string password)
		{
			return Sha256(password);
		}

        // todo : add new column for random salt
		public static string Salt()
		{
			return "9B5537D6-5DDE-4CA8-A71E-45171D722F8D"; 
		}

		public static string Sha256(string value)
		{
			return Sha256(value, Salt());
		}


        // update to sha 256
		public static string Sha256(string value,string salt)
		{
            using (HashAlgorithm hashAlgorithm = SHA256.Create())
            {
                byte[] plainText = Encoding.UTF8.GetBytes(value + salt);
                byte[] hash = hashAlgorithm.ComputeHash(plainText);

                StringBuilder s = new StringBuilder();
                foreach (byte b in hash)
                {
                    s.Append(b.ToString("x2"));
                }

                return s.ToString().ToLower();
            }
        }

        public static string CreateHashOnDoc(string url)
        {
            var webRequest = WebRequest.Create(url);

            using (var response = webRequest.GetResponse())
            using (var content = response.GetResponseStream())
            using (var reader = new StreamReader(content))
            {
                var strContent = reader.ReadToEnd();

                return Sha256(strContent);
            }         
        }
        
        public static bool IsSuperAdministrator(IIdentity userIdentity)
		{
			return IsSuperAdministrator(GetUserInfoId(userIdentity));
		}

		public static bool IsSuperAdministrator(Guid userInfoId)
		{
			return userInfoId == Guid.Parse(SystemConstant.SUPER_ADMINISTRATOR_USERINFOID);
		}

		public static bool IsAccessAvailable(IIdentity userIdentity,string accessName)
		{
			string accessRights = string.Empty;

			accessRights = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_ACCESSRIGHTS)
					.Select(c => c.Value).SingleOrDefault();

			string[] access = accessRights.Split(',');
			string accessValue = access.FirstOrDefault(v => v.Contains(accessName));

			if (accessValue == string.Empty) return false;

			return bool.Parse(accessValue.Replace(string.Format("{0}:",accessName),""));
		}

		public static string GetAccessRights(IIdentity userIdentity)
		{
			string accessRights = string.Empty;

			accessRights = GetClaims(userIdentity).Claims.Where(c => c.Type == SystemConstant.CLAIM_ACCESSRIGHTS)
					.Select(c => c.Value).SingleOrDefault();

			return accessRights;
		}
	}
}
