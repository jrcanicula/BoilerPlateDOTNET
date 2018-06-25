using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
	public class EntityHistory:Auditable
	{
		[Identifier()]
		public Guid EntityHistoryId { get; set; }
		public Guid VendorId { get; set; }
		public Guid EntityId { get; set; }
		public int Status { get; set; }
		public int Alert { get; set; }
	}
}
