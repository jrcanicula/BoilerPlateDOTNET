CREATE TABLE [dbo].[AccessHistory]
(
  [AccessHistoryId] UNIQUEIDENTIFIER NOT NULL,
  [AccessId] UNIQUEIDENTIFIER NOT NULL,
  [Category] NVARCHAR(100) NOT NULL,   
  [Name] NVARCHAR(100) NOT NULL,    
  [Description] NVARCHAR(max) NULL,    
  [CreatedBy] UNIQUEIDENTIFIER NULL, 
  [CreatedOn] DATETIME NULL, 
  [ModifiedBy] UNIQUEIDENTIFIER NULL, 
  [ModifiedOn] DATETIME NULL
)
