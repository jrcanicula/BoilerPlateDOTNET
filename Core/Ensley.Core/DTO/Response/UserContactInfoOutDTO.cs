using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Response
{
	public class UserContactInfoOutDTO
	{
		public Guid? UserInfoId { get; set; }
		public string FullName { get; set; }
		public string Email { get; set; }
		public string Country { get; set; }
		public string Address { get; set; } 
		public string ContactNo { get; set; }
	}
}
