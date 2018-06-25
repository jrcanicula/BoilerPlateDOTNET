using SAM.Core.Domain;
using SAM.Core.DTO.Generic;
using SAM.Core.DTO.Request;
using SAM.Core.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAM.Core.RepositoryInterface
{
	public interface IVendorRepository:IDapperRepository<Entity>
	{
		IEnumerable<VendorHistoryOutDTO> GetVendorHistory(Guid vendorId);
		IEnumerable<VendorContactHistoryOutDTO> GetVendorContactHistory(Guid vendorId);
		IEnumerable<VendorAlertHistoryOutDTO> GetVendorAlertHistory(Guid vendorId);
		IEnumerable<VendorUserInfoDTO> GetVendorContacts(Guid vendorId);
		VendorGeneralInformationDTO GetVendorGeneralInformation(Guid vendorId);
		VendorAlertDTO GetVendorAlerts(Guid vendorId);
		IEnumerable<UserInfoFullNameDTO> GetVendorUsers(Guid vendorId);
		bool UpdateVendorContacts(Guid vendorId,Guid userInfoId,string contactItems,string deletedContacts);
		bool UpdateVendorAlerts(VendorAlertsInDTO vendorAlerts,Guid userInfoId);

		Guid GetPrimaryContact(Guid vendorId);
	}
}
