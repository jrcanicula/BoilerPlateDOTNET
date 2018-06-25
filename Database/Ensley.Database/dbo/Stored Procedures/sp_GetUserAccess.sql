CREATE PROCEDURE [dbo].[sp_GetUserAccess](
  @UserInfoId AS UNIQUEIDENTIFIER
)
AS
BEGIN
   SELECT a.AccessId, a.[Description], a.[Name], a.[Category] from UserInfo u
   INNER JOIN UserRole ur ON ur.[UserId] = u.UserInfoId
   INNER JOIN [Role] r ON ur.RoleId = r.RoleId
   INNER JOIN [RoleAccess] ra ON r.RoleId = ra.RoleId
   INNER JOIN [Access] a ON a.AccessId = ra.AccessId
   WHERE UserInfoId = @UserInfoId
   GROUP BY A.AccessId, a.[Description], a.[Name], a.[Category]
END

