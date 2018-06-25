CREATE PROCEDURE sp_GetUnmappedRoles
(
	@UserInfoId AS UNIQUEIDENTIFIER		
)
AS
BEGIN

SELECT [Role].[RoleId], [Role].[Name] from [dbo].[Role] where [RoleId] NOT IN

(SELECT [Role].[RoleId] from [dbo].[Role]
    INNER JOIN [dbo].[UserRole]
    ON [dbo].[UserRole].[RoleId] = [dbo].[Role].[RoleId] where [UserRole].[UserId] =  @UserInfoId
)

ORDER BY [Role].[CreatedOn] ASC
END
GO