CREATE PROCEDURE sp_GetUnmappedAccess
(
	@RoleId AS UNIQUEIDENTIFIER		
)
AS
BEGIN

SELECT [Access].[AccessId], [Access].[Name], [Access].[Category] FROM [dbo].[Access] WHERE [AccessId]
 NOT IN
(SELECT a.[AccessId] FROM [dbo].[Access] a
    INNER JOIN [dbo].[RoleAccess] ra
    on ra.[AccessId] = a.[AccessId] where ra.[RoleId] =  @RoleId
)
Order BY [Access].[CreatedOn] ASC

END
GO