using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Generic
{
	public class UserInfoFullNameDTO
	{
		public Guid UserInfoId { get; set; }
        [Required]
        [StringLength(400)]
        public string FullName { get; set; }
	}
}
