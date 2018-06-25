using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.ServiceInterface
{
	public interface IClientService
	{
		bool IsClient(Guid entityId);
	} 
}
