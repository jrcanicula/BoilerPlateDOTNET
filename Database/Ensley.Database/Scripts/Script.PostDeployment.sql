/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

	DECLARE  @createdBy UNIQUEIDENTIFIER=  'BBCE711E-2A3E-4D5B-A19F-75A5412F5560';
  DECLARE  @createdOn DATETIME =  GETUTCDATE();
  DECLARE  @organizationId UNIQUEIDENTIFIER; 
  DECLARE  @organizationName NVARCHAR(20) = 'DEMO'; 

SET NOCOUNT ON
BEGIN
  :r .\01_User.sql	
  :r .\02_Access.sql	
  :r .\03_Role.sql
  :r .\05_Vendor.sql
END
