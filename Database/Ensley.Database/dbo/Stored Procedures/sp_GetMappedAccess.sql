CREATE PROCEDURE sp_GetMappedAccess
(
	@RoleId AS UNIQUEIDENTIFIER
)
AS
BEGIN

SELECT [Access].[AccessId], [Access].[Name],[Access].[Category] from [dbo].[Access]
    INNER JOIN [dbo].[RoleAccess]
    ON [dbo].[Access].[AccessId] = [dbo].[RoleAccess].[AccessId] where [RoleAccess].[RoleId] =  @RoleId

ORDER BY [Access].[CreatedOn] ASC
END
GO