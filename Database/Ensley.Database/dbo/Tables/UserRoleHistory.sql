CREATE TABLE [dbo].[UserRoleHistory](
       [UserRoleHistoryId] UNIQUEIDENTIFIER NOT NULL,
	   [UserRoleId] UNIQUEIDENTIFIER NOT NULL,
	   [UserId] UNIQUEIDENTIFIER NOT NULL,
	   [RoleId] UNIQUEIDENTIFIER NOT NULL,
       [Name] NVARCHAR(200) NULL,
	   [CreatedOn] DATETIME NULL,
       [CreatedBy] UNIQUEIDENTIFIER NULL,
       [ModifiedOn] DATETIME NULL,
       [ModifiedBy] UNIQUEIDENTIFIER NULL,
PRIMARY KEY CLUSTERED 
(
       [UserRoleHistoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
