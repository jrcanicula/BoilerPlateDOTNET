using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Request
{
	public class AccessInDTO
	{
		public Guid? AccessId { get; set; }
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
        [StringLength(1000)]
        public string Description { get; set; }
        [Required]
        [StringLength(200)]
        public string Category { get; set; }
	}
}
