using Ensley.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Response
{
	public class UserInfoDTO:UserInfo
	{
		public IEnumerable<AccessOutDTO> Access { get; set; }
		public bool HasAccess(Guid accessId)
		{
			if (Security.Security.IsSuperAdministrator(this.UserInfoId))
			{
				return true;
			}

			if (Access != null && Access.Count() > 0)
			{
				return Access.Any(c => c.AccessId == accessId);
			}
			else
			{
				return false;
			}
		}
	}
}
