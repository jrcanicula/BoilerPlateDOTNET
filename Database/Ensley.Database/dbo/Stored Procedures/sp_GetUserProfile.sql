CREATE PROCEDURE sp_GetUserProfile(
	@UserInfoId UNIQUEIDENTIFIER
)
AS
BEGIN

SELECT 
 u.FirstName, 
 u.LastName,
 u.ImageURL,
 [Password],
 u.Email,
 u.[Address],
 u.ContactNo,
 Position,
 v.Name AS Company,
 u.Country
FROM dbo.[UserInfo] u 
INNER JOIN
dbo.Entity v ON u.EntityId = v.EntityId
WHERE u.UserInfoId=@UserInfoId

END