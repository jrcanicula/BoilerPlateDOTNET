using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
	public class UserInfo:Auditable
	{
		[Identifier()]
		public Guid UserInfoId { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string ContactNo { get; set; }
		public int? Status { get; set; }
		public string Address { get; set; }
		public string Position { get; set; }
		public Guid? EntityId { get; set; }
		public string Timezone { get; set; }
		public string ImageURL { get; set; }
		public string Country { get; set; }
	}
}
