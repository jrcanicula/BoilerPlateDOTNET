using Ensley.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Domain
{
	public class Configuration:Auditable
	{
		[Identifier()]
		public Guid ConfigurationId { get; set; }
		public int Category { get; set; }
		public string Key { get; set; }
		public string Value { get; set; }
		public string Description { get; set; }
	}
}
