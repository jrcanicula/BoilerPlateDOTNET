using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
  public class Role : Auditable
  {
    [Identifier()]
    public Guid RoleId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int? Status { get; set; }
  }
}
