using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain.Config
{
    public class Organizations : Auditable
    {
        [Identifier()]
        public Guid OrganizationId { get; set; }
        public string Name { get; set; }
        public string FriendlyName { get; set; }
        public bool IsActive { get; set; }
        public string ConnectionString { get; set; }
    }
}
