
--SAM!@Acc#!Tr
IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[UserInfo] WHERE [UserInfoId] = 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560'))
INSERT INTO [dbo].[UserInfo]([UserInfoId],[FirstName],[LastName],[Password],[Email],[Timezone], [CreatedBy], [CreatedOn],[Status],[EntityId])
	 VALUES ('BBCE711E-2A3E-4D5B-A19F-75A5412F5560','superadmin', 'lastname','a53d391ed3ab424ee9e52f4ddc42d347bb8e5178789c5f80381d62dd1a274e1b','superadmin@test.com', '', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETUTCDATE(),1,'006D4C84-F554-4188-B4D7-B31F54B7F571')

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[UserInfo] WHERE [UserInfoId] = 'CBCE711E-2A3E-4D5B-A19F-75A5412F5560'))
INSERT INTO [dbo].[UserInfo]([UserInfoId],[FirstName],[LastName],[Password],[Email],[Timezone], [CreatedBy], [CreatedOn], [Position],[Status],[EntityId])
	 VALUES ('CBCE711E-2A3E-4D5B-A19F-75A5412F5560','Jaime', 'Canicula','a53d391ed3ab424ee9e52f4ddc42d347bb8e5178789c5f80381d62dd1a274e1b','jaime.canicula@company.com', '', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETUTCDATE(),'Chief Technology Officer',1,'2E67585C-5571-4237-B9FA-FFFF0117011B')

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[UserInfo] WHERE [UserInfoId] = '95BC0E4D-98BA-4FFA-B3A0-945D2781FAF0'))
INSERT INTO [dbo].[UserInfo]([UserInfoId],[FirstName],[LastName],[Password],[Email],[Address],[ContactNo],[EntityId],[Status],[Position],[Timezone], [CreatedBy], [CreatedOn])
	 VALUES ('95BC0E4D-98BA-4FFA-B3A0-945D2781FAF0','Jenny', 'Cole','a53d391ed3ab424ee9e52f4ddc42d347bb8e5178789c5f80381d62dd1a274e1b','jenny.cole@email.com','Redwood City, California','+1 234 3444','2E67585C-5571-4237-B9FA-FFFF0117011B',1,'Oracle Sales Officer', '', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETUTCDATE())

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[UserInfo] WHERE [UserInfoId] = 'A55DA0F8-0ECE-46F0-A2FE-F4CFE44C355E'))
INSERT INTO [dbo].[UserInfo]([UserInfoId],[FirstName],[LastName],[Password],[Email],[Address],[ContactNo],[EntityId],[Status],[Position],[Timezone], [CreatedBy], [CreatedOn])
	 VALUES ('A55DA0F8-0ECE-46F0-A2FE-F4CFE44C355E','Sandra', 'Client','a53d391ed3ab424ee9e52f4ddc42d347bb8e5178789c5f80381d62dd1a274e1b','sandra.smith@email.com','Newtown Square, PA','+1 777 2111','006D4C84-F554-4188-B4D7-B31F54B7F571',1,'SAP Sales Officer', '', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETUTCDATE())

IF(NOT EXISTS(SELECT TOP 1 * FROM [dbo].[UserInfo] WHERE [UserInfoId] = '7AF76EF4-E297-469B-80E5-8C49A6B7DBEF'))
INSERT INTO [dbo].[UserInfo]([UserInfoId],[FirstName],[LastName],[Password],[Email],[Address],[ContactNo],[EntityId],[Status],[Position],[Timezone], [CreatedBy], [CreatedOn])
	 VALUES ('7AF76EF4-E297-469B-80E5-8C49A6B7DBEF','Peter', 'Vendor','a53d391ed3ab424ee9e52f4ddc42d347bb8e5178789c5f80381d62dd1a274e1b','peter.patterson@email.com','San Francisco','+1 232 3445','2E67585C-5571-4237-B9FA-FFFF0117011B',1,'Salesforce Sales Officer', '', 'BBCE711E-2A3E-4D5B-A19F-75A5412F5560',GETDATE())

--UPDATE [dbo].[UserInfo] SET CompanyId = '2E67585C-5571-4237-B9FA-FFFF0117011B'


