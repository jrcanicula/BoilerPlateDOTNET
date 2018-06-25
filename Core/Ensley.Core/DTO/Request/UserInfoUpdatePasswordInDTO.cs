using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Request
{
	public class UserInfoUpdatePasswordInDTO
    {
        [Required]
        [StringLength(200)]
        public string Password { get; set; }

		public Guid UserInfoId { get; set; }
	}
}
 