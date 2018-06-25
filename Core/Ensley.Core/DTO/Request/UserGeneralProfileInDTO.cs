using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Request
{
	public class UserGeneralProfileInDTO
	{
		[StringLength(200)]
		public string ContactNo { get; set; }
		[StringLength(200)]
		public string Position { get; set; }
		[StringLength(1000)]
		public string Address { get; set; }
		public Guid UserInfoId { get; set; }
		public string ImageURL { get; set; }
		[Required]
		[StringLength(100)]
		public string Country { get; set; }
	}
}
