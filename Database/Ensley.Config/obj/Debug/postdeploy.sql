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
	DECLARE  @createdOn DATETIME =  GETDATE();

SET NOCOUNT ON
BEGIN
IF(N'Debug' = ISNULL(N'$(DeployConfiguration)', N'Debug'))
	BEGIN
	IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Organizations] WHERE OrganizationId = '1334EC97-AB03-4F73-BCAC-414F643ACE21'))
	INSERT INTO [dbo].[Organizations]([OrganizationId],[Name],[FriendlyName],[ConnectionString])
           VALUES ('1334EC97-AB03-4F73-BCAC-414F643ACE21','DEMO','DEMO','Server=.;Database=SAM-Demo-DEV;Trusted_Connection=True;Enlist=false;')
	END
IF(N'Production' = ISNULL(N'$(DeployConfiguration)', N'Production'))
	BEGIN	IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Organizations] WHERE OrganizationId = '846A4037-6DE8-41AC-A379-988D04929FEA'))
	INSERT INTO [dbo].[Organizations]([OrganizationId],[Name],[FriendlyName],[ConnectionString])
           VALUES ('846A4037-6DE8-41AC-A379-988D04929FEA','DEMO','DEMO','')
    END

IF(N'Staging' = ISNULL(N'$(DeployConfiguration)', N'Staging'))
	BEGIN	IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Organizations] WHERE OrganizationId = '846A4037-6DE8-41AC-A379-988D04929FEA'))
	INSERT INTO [dbo].[Organizations]([OrganizationId],[Name],[FriendlyName],[ConnectionString])
           VALUES ('846A4037-6DE8-41AC-A379-988D04929FEA','DEMO','DEMO','')
    END



END
GO
