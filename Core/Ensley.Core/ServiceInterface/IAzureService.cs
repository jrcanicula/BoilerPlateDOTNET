
using System;
using System.Threading.Tasks;

namespace Arrow.Tools.Core.ServiceInterface
{
	public interface IAzureService
	{
		Task<string> SetProfileImageToDefault(Guid userInfoId,string blobContainer);
		Task<string> SetVendorImageToDefault(Guid userInfoId,string blobContainer);
		string UploadProfileImage(byte[] imageByte,string imageName,string organizationName);
		Task<string> UploadResource(byte[] fileByte,string fileName,string organizationName);
		string UploadCompanyImage(byte[] imageByte,string imageName,string blobContainer);
        string UploadPaymentAttachment(byte[] fileByte, string fileName, string organizationName);
    }
}
