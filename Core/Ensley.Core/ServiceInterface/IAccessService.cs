using Ensley.Core.Domain;
using Ensley.Core.DTO.Request;
using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.ServiceInterface
{
  public interface IAccessService
  {
    IEnumerable<Access> GetAccesses();

    bool CreateAccess(AccessInDTO Access);

    bool DeleteAccess(Guid AccessId);

    bool UpdateAccess(AccessInDTO Access);

    IEnumerable<AccessMappingItemOutDTO> GetAvailableAccessMappings();
  }
}
