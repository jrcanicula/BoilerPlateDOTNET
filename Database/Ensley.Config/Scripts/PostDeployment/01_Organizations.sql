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


