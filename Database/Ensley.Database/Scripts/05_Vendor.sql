IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = '2E67585C-5571-4237-B9FA-FFFF0117011B'))
INSERT INTO [dbo].[Entity]([EntityId],[Status],[Alert], [Name], [Email],[CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn],[IsVendor],[IsClient],[Description],[ImageURL])
	 VALUES ('2E67585C-5571-4237-B9FA-FFFF0117011B',1,1, 'Microsoft', 'test@microsoft.com','BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),1,0,'Microsoft Description','https://samprime.blob.core.windows.net/samprime/common/company-profile-dev/dummy-logo.png')

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = '92713E68-7283-4A31-9ED5-39F4C4DABE28'))
INSERT INTO [dbo].[Entity]([EntityId],[Status],[Alert], [Name], [Email], [CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn],[IsVendor],[IsClient],[Description],[ImageURL])
	 VALUES ('92713E68-7283-4A31-9ED5-39F4C4DABE28',1,1, 'Oracle', 'test@oracle.com','BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),1,0,'Oracle Description','https://samprime.blob.core.windows.net/samprime/common/company-profile-dev/dummy-logo.png')

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = '270045E8-02BD-4899-9716-725F75220057'))
INSERT INTO [dbo].[Entity]([EntityId],[Status],[Alert],[Name], [Email],[CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn],[IsVendor],[IsClient],[Description],[ImageURL])
	 VALUES ('270045E8-02BD-4899-9716-725F75220057', 1,1, 'SAP','test@sap.com','BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),1,0,'SAP Description','https://samprime.blob.core.windows.net/samprime/common/company-profile-dev/dummy-logo.png')

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = 'B1DDE66A-9598-45FC-971F-2B2621D5B854'))
INSERT INTO [dbo].[Entity]([EntityId],[Status],[Alert], [Name], [Email],[CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn],[IsVendor],[IsClient],[Description],[ImageURL])
	 VALUES ('B1DDE66A-9598-45FC-971F-2B2621D5B854', 1, 2, 'Tesla', 'test@tesla.com','BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),1,0,'Tesla Description','https://samprime.blob.core.windows.net/samprime/common/company-profile-dev/dummy-logo.png')

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Entity] WHERE [EntityId] = '006D4C84-F554-4188-B4D7-B31F54B7F571'))
INSERT INTO [dbo].[Entity]([EntityId],[Status],[Alert], [Name], [Email],[CreatedBy], [CreatedOn],[ModifiedBy],[ModifiedOn],[IsVendor],[IsClient],[Description],[ImageURL])
	 VALUES ('006D4C84-F554-4188-B4D7-B31F54B7F571', 1, 1, 'Shell', 'shell@shell.com','BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE(),0,1,'Shell Description','https://samprime.blob.core.windows.net/samprime/common/company-profile-dev/dummy-logo.png')
