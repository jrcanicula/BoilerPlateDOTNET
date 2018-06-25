CREATE TABLE [dbo].[UserInfo](
       [UserInfoId] UNIQUEIDENTIFIER NOT NULL,
       [FirstName]  NVARCHAR(200) NULL,
	   [LastName]  NVARCHAR(200) NULL,
       [Email] NVARCHAR(200) NOT NULL,
	   [Password] NVARCHAR(200) NULL,
     [ContactNo] NVARCHAR(200) NULL,
	   [Status] INT NULL,
	   [Address] NVARCHAR(1000) NULL,
	   [Position] NVARCHAR(200) NULL,
	   [EntityId] UNIQUEIDENTIFIER  NOT NULL, -- to be EntityId
	   [Timezone] NVARCHAR(100)  NULL,
     [ImageURL] NVARCHAR(max) NULL,
	   [Country] NVARCHAR(100)  NULL,
     [CreatedOn] DATETIME NULL,
     [CreatedBy] UNIQUEIDENTIFIER NULL,
     [ModifiedOn] DATETIME NULL,
     [ModifiedBy] UNIQUEIDENTIFIER NULL,
PRIMARY KEY CLUSTERED 
(
       [UserInfoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
