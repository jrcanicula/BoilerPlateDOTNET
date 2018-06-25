CREATE PROCEDURE sp_GetUserContactInfo
AS 
    SET NOCOUNT ON;
    SELECT UserInfoId, FirstName + ' ' + LastName AS FullName,
    Email, Country, ContactNo, [Address]
	FROM [UserInfo]
GO