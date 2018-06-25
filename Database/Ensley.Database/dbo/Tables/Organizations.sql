CREATE TABLE [dbo].[Organizations]
(
	[OrganizationId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(100) NOT NULL, 
    [FriendlyName] NVARCHAR(100) NOT NULL, 
	[ConnectionString] NVARCHAR(256) NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1, 
	[IsClient] BIT NULL,
	[IsVendor] BIT NULL,
    [CreatedOn] DATETIME NULL,
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [ModifiedOn] DATETIME NULL,
    [ModifiedBy] UNIQUEIDENTIFIER NULL,
)
