--*********************************
-- Access
--*********************************
--System

--DECLARE @AccessDashboard UNIQUEIDENTIFIER = 'A2BFC174-34A8-46FC-B4E0-87B763E67733';
IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Access] WHERE [AccessId] = 'A2BFC174-34A8-46FC-B4E0-87B763E67733')
	INSERT INTO Access
	(AccessId, Category, Name, [Description], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn)
		VALUES ('A2BFC174-34A8-46FC-B4E0-87B763E67733', 'Navigation', 'Dashboard Navigation', 'Access to navigate in the dashboard', @createdBy, @createdOn, @createdBy, @createdOn)
--DECLARE @AccessContract UNIQUEIDENTIFIER = 'C308F8CA-13F1-447E-9C18-C82F0CA2DB8B';
IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Access] WHERE [AccessId] = 'C308F8CA-13F1-447E-9C18-C82F0CA2DB8B')
	INSERT INTO Access
	(AccessId, Category, Name, [Description], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn)
		VALUES ('C308F8CA-13F1-447E-9C18-C82F0CA2DB8B', 'Navigation', 'Contract Navigation', 'Access to navigate in the contract page', @createdBy, @createdOn, @createdBy, @createdOn)

--DECLARE @AccessUserManagement UNIQUEIDENTIFIER = '72E0DCDF-0E11-49D6-AEC9-4533014059FA';
IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Access] WHERE [AccessId] = '72E0DCDF-0E11-49D6-AEC9-4533014059FA')
	INSERT INTO Access
	(AccessId, Category, Name, [Description], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn)
		VALUES ('72E0DCDF-0E11-49D6-AEC9-4533014059FA', 'Navigation', 'User Management Navigation', 'Access to navigate in user management', @createdBy, @createdOn, @createdBy, @createdOn)

