using Ensley.Core.Domain;
using Ensley.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.RepositoryInterface
{
  public interface IRoleRepository : IDapperRepository<Role>
  {
    IEnumerable<AccessMappingItemOutDTO> GetUnmappedAccess(Guid roleId);

    IEnumerable<AccessMappingItemOutDTO> GetMappedAccess(Guid roleId);
  }
}
