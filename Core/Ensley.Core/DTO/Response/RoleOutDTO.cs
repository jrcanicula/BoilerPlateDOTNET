using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Response
{
  public class RoleOutDTO
  {
    public Guid? RoleId { get; set; }
    public string Name { get; set; } 
    public string Description { get; set; }
    public string Category { get; set; }
    public int? Status { get; set; }
    public DateTime? CreatedOn { get; set; }
  }
}
