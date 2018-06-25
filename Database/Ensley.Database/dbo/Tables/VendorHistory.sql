CREATE TABLE [dbo].[EntityHistory](
       [EntityHistoryId] UNIQUEIDENTIFIER NOT NULL,
	     [EntityId] UNIQUEIDENTIFIER NOT NULL,
	     [Name]  NVARCHAR(200) NULL,
	     [Description] NVARCHAR(1000) NULL,	
	     [Address] NVARCHAR(1000) NULL,	
       [ContactNo] NVARCHAR(200) NULL,
	     [Email] NVARCHAR(200) NULL,
	     [Status] INT NULL,
       [ImageURL] nvarchar(max),
	     [Alert] INT NULL,
       [TotalContractValue] DECIMAL(19,4) NULL,
	     [CreatedOn] DATETIME NULL,
       [CreatedBy] UNIQUEIDENTIFIER NULL,
       [ModifiedOn] DATETIME NULL,
       [ModifiedBy] UNIQUEIDENTIFIER NULL,
PRIMARY KEY CLUSTERED 
(
       [EntityHistoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
