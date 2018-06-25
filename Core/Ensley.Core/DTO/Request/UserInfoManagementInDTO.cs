using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Request
{
	public class UserInfoManagementInDTO
	{
		public Guid? UserInfoId { get; set; }
        [Required]
        [StringLength(200)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(200)]
        public string LastName { get; set; }
        [Required]
        [StringLength(200)]
        public string Email { get; set; }
        [StringLength(200)]
        public string ContactNo { get; set; }
        [Required]
        [StringLength(200)]
        public string Country { get; set; }
        [Range(0, 10)]
        public int? Status { get; set; }      
        [StringLength(1000)]
        public string Address { get; set; }
        [StringLength(200)]
        public string Position { get; set; }
		public Guid? CompanyId { get; set; }     
		public string Timezone { get; set; }
		public IEnumerable<RoleMappingItemOutDTO> RoleMappingItems { get; set; }
	}
}
