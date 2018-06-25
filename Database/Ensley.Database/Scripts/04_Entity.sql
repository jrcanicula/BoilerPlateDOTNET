IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = 'E32E5E8B-8063-417E-9422-F821EE4D2553'))
INSERT INTO [dbo].[Entity]([EntityId],[Name],[Status],[Description],[Address],[ContactNo], [CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn])
	 VALUES ('E32E5E8B-8063-417E-9422-F821EE4D2553','Microsoft', 1,'Microsoft Corporation','One Microsoft Way in Redmond, Washington','+1 800 1 110 2363', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE())

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = 'A953958A-E757-4786-86AC-2015EBDF0DEB'))
INSERT INTO [dbo].[Entity]([EntityId],[Name],[Status],[Description],[Address],[ContactNo], [CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn])
	 VALUES ('A953958A-E757-4786-86AC-2015EBDF0DEB','Oracle', 1,'Oracle Corporation','Redwood City, California, United States','+1 800 223 1711', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE())

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = '0C22FB40-AED2-4888-92ED-E74235BA3E3C'))
INSERT INTO [dbo].[Entity]([EntityId],[Name],[Status],[Description],[Address],[ContactNo], [CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn])
	 VALUES ('0C22FB40-AED2-4888-92ED-E74235BA3E3C','Salesforce', 1,'Cloud computing company','The Landmark @ One Market Suite 300. San Francisco','+1800-NO-SOFTWARE', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE())

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = 'B04D223E-9BF0-4AEC-82ED-AB35FF0E6670'))
INSERT INTO [dbo].[Entity]([EntityId],[Name],[Status],[Description],[Address],[ContactNo], [CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn])
	 VALUES ('B04D223E-9BF0-4AEC-82ED-AB35FF0E6670','SAP', 1,'SAP Software & Solutions','3999 West Chester Pike Newtown Square, PA 19073 USA','+1800-165 10761', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE())