using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Request
{
  public class RoleInDTO
  {
        public Guid? RoleId { get; set; }
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
        [Required]
        [StringLength(1000)]
        public string Description { get; set; }
        [Range(0, 10)]
        public int? Status { get; set; } 
        public IEnumerable<AccessMappingItemOutDTO> AccessMappingItems { get; set; }
  }
}
