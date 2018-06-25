--*********************************
-- Access
--*********************************
--System

--DECLARE @AccessDashboard UNIQUEIDENTIFIER = 'A2BFC174-34A8-46FC-B4E0-87B763E67733';
IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Role] WHERE [RoleId] = 'B1B372B0-9E9E-42FA-99C5-5F5F4EDEC812')
	INSERT INTO Role
	(RoleId, Name, [Description], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn)
		VALUES ('B1B372B0-9E9E-42FA-99C5-5F5F4EDEC812',  'Administrator', 'Administrator', @createdBy, @createdOn, @createdBy, @createdOn)
--DECLARE @AccessContract UNIQUEIDENTIFIER = 'C308F8CA-13F1-447E-9C18-C82F0CA2DB8B';
IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Role] WHERE [RoleId] = '51EF0A43-0ECB-4CEA-A753-BDA71A4DE33C')
	INSERT INTO Role
	(RoleId, Name, [Description], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn)
		VALUES ('51EF0A43-0ECB-4CEA-A753-BDA71A4DE33C',  'User', 'User', @createdBy, @createdOn, @createdBy, @createdOn)