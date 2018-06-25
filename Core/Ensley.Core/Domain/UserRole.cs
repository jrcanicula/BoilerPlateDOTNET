using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
  public class UserRole : Auditable
  {
    [Identifier()]
    public Guid UserRoleId { get; set; }
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
  }
}
