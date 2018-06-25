using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
  public class User : Auditable
  {
    [Identifier()]
    public Guid UserId { get; set; }
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }
    public string ContactNo { get; set; }


    public int? Status { get; set; }

    public string Address { get; set; }

    public string Position { get; set; }

    public Guid? CompanyId { get; set; }

    public string TimeZone { get; set; }


  }
}
