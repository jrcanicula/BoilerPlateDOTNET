using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
    interface IAuditable
    {
        Guid? CreatedBy { get; set; }
        DateTime? CreatedOn { get; set; }
        Guid? ModifiedBy { get; set; }
        DateTime? ModifiedOn { get; set; }
    }
}
