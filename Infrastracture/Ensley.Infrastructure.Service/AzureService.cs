using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ensley.Core.Common;
using Ensley.Core.Security.Config;
using Ensley.Core.Utils;
using Arrow.Tools.Core.ServiceInterface;
using Ensley.Core.ServiceInterface;

namespace Ensley.Infrastructure.Service
{
	public class AzureService:IAzureService
	{
		private readonly StorageCredentials storageCredentials;
		private readonly Dictionary<string,string> configuration;

		public AzureService(IConfigurationService configurationService,IOrganizationService organizationService)
		{
			configuration = configurationService.SelectAll().ToDictionary(x => x.Key,x => x.Value);
			storageCredentials = new StorageCredentials(configuration["azure-account-name"],configuration["azure-account-key"]);
		}
		public string UploadProfileImage(byte[] imageByte,string imageName,string blobContainer)
		{
			try
			{
				CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials,false);
				CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

				string completeOrgname = blobContainer;

				CloudBlobContainer container = blobClient.GetContainerReference(completeOrgname);

				container.CreateIfNotExistsAsync();
				container.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });
				imageName = configuration["azure-container-userprofile"] + "/" + imageName;

				CloudBlockBlob blockBlob = container.GetBlockBlobReference(imageName);
				blockBlob.UploadFromByteArray(imageByte,0,imageByte.Length);

				return blockBlob.Uri.AbsoluteUri;
			}
			catch
			{

			}
			return string.Empty;
		}
		public string UploadCompanyImage(byte[] imageByte,string imageName,string blobContainer)
		{
			try
			{
				CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials,false);
				CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

				string completeOrgname = blobContainer;

				CloudBlobContainer container = blobClient.GetContainerReference(completeOrgname);

				container.CreateIfNotExistsAsync();
				container.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });
				imageName = configuration["azure-container-company-image"] + "/" + imageName;

				CloudBlockBlob blockBlob = container.GetBlockBlobReference(imageName);
				blockBlob.UploadFromByteArray(imageByte,0,imageByte.Length);

				return blockBlob.Uri.AbsoluteUri;
			}
			catch
			{

			}

			return string.Empty;
		}

        public string UploadPaymentAttachment(byte[] fileByte, string fileName, string organizationName)
        {
            try
            {
                CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials, false);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                CloudBlobContainer container = blobClient.GetContainerReference(organizationName);

                container.CreateIfNotExistsAsync();
                container.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });
                fileName = configuration["azure-container-production-payment-attachment"] + "/" + fileName;

                CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);
                blockBlob.UploadFromByteArrayAsync(fileByte, 0, fileByte.Length);

                return blockBlob.Uri.AbsoluteUri;
            }
            catch (Exception ex)
            {

            }

            return string.Empty;
        }


        public async Task<string> SetProfileImageToDefault(Guid userInfoId,string blobContainer)
		{
			try
			{
				CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials,true);
				CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

				//string completeOrgname = blobContainer + "-" + Common.Environment.ToLower();
				string completeOrgname = blobContainer;

				CloudBlobContainer sourceContainer = blobClient.GetContainerReference(completeOrgname);
				await sourceContainer.CreateIfNotExistsAsync();
				await sourceContainer.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });

				string noImageFilename = configuration["azure-container-company-image"] + "/" + "no-image.png";
				string destFilename = configuration["azure-container-company-image"] + "/" + string.Format("{0}.png",userInfoId);

				CloudBlockBlob sourceBlob = sourceContainer.GetBlockBlobReference(noImageFilename);
				CloudBlockBlob targetBlob = sourceContainer.GetBlockBlobReference(destFilename);
				await targetBlob.StartCopyAsync(sourceBlob);

				return String.Format(targetBlob.Uri.AbsoluteUri);
			}
			catch (Exception ex)
			{
			
			}

  		return string.Empty;
		}

		public async Task<string> SetVendorImageToDefault(Guid userInfoId,string blobContainer)
		{
			try
			{
				CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials,true);
				CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
				//string completeOrgname = blobContainer + "-" + Common.Environment.ToLower();
				string completeOrgname = blobContainer;
				CloudBlobContainer sourceContainer = blobClient.GetContainerReference(completeOrgname);
				await sourceContainer.CreateIfNotExistsAsync();
				await sourceContainer.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });

				string noImageFilename = configuration["azure-container-userprofile"] + "/" + "no-image.png";
				string destFilename = configuration["azure-container-userprofile"] + "/" + string.Format("{0}.png",userInfoId);

				CloudBlockBlob sourceBlob = sourceContainer.GetBlockBlobReference(noImageFilename);
				CloudBlockBlob targetBlob = sourceContainer.GetBlockBlobReference(destFilename);
				await targetBlob.StartCopyAsync(sourceBlob);

				return String.Format(targetBlob.Uri.AbsoluteUri);
			}
			catch (Exception ex)
			{

			}

			return string.Empty;
		}

		public async Task<string> UploadResource(byte[] fileByte,string fileName,string organizationName)
		{
			try
			{
				CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials,false);
				CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

				fileName = configuration["azure-container-resource-isocial"] + "/" + fileName;
				CloudBlobContainer container = blobClient.GetContainerReference(organizationName);
				await container.CreateIfNotExistsAsync();
				await container.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });
				CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);
				blockBlob.Properties.ContentType = "";
				await blockBlob.UploadFromByteArrayAsync(fileByte,0,fileByte.Length);
				return fileName;
			}
			catch (Exception ex)
			{

			}

			return string.Empty;
		}

		public async Task<bool> CopyContainer(string sourceOrganizationName,string destinationOrganizationName)
		{
			try
			{
				CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials,false);
				CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

				CloudBlobContainer sourceContainer = blobClient.GetContainerReference(sourceOrganizationName);
				await sourceContainer.CreateIfNotExistsAsync();
				await sourceContainer.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });

				CloudBlobContainer destContainer = blobClient.GetContainerReference(destinationOrganizationName);
				await destContainer.CreateIfNotExistsAsync();
				await destContainer.SetPermissionsAsync(new BlobContainerPermissions() { PublicAccess = BlobContainerPublicAccessType.Container });

				var blobs = await sourceContainer.ListBlobsSegmentedAsync(string.Empty,true,BlobListingDetails.All,500,null,null,null);
				foreach (IListBlobItem srcBlob in blobs.Results)
				{
					Uri thisBlobUri = srcBlob.Uri;
					var serverBlob = blobClient.GetBlobReferenceFromServerAsync(thisBlobUri);

					CloudBlockBlob targetBlob = destContainer.GetBlockBlobReference(serverBlob.Result.Name);

					await targetBlob.StartCopyAsync(thisBlobUri);
				}
			}
			catch (Exception ex)
			{
				return false;
			}
			return true;
		}
	}
}
