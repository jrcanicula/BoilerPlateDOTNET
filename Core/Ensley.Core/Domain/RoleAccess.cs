using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
  public class RoleAccess:Auditable
  {
    [Identifier()]
    public Guid RoleAccessId { get; set; }
    public Guid RoleId { get; set; }
    public Guid AccessId { get; set; }
  }
}
