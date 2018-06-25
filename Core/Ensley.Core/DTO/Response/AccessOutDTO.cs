using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Response
{
	public class AccessOutDTO
	{
		public Guid AccessId { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Category { get; set; }
		public DateTime? CreatedOn { get; set; } 
	}
}
