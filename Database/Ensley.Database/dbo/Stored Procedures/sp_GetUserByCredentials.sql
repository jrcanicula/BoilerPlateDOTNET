CREATE PROCEDURE sp_GetUserByCredentials
	@Username NVARCHAR(200) = null ,
	@Password NVARCHAR(400) = null
AS
BEGIN
	SET NOCOUNT ON;
    SELECT 
	 [user].[UserInfoId]
	,[user].[Email]
	,[user].[Password]
	,[user].FirstName
	,[user].LastName
	,[user].Timezone
	,[user].[Status]
  ,[user].[EntityId]
	,[user].[CreatedBy]
	,[user].[CreatedOn]
	,[user].[ModifiedBy]
	,[user].[ModifiedOn]
	FROM UserInfo [user]
	WHERE ([user].Email = @Username AND [user].[Password] = @Password)
  AND ([user].[Status] = 1)
END
GO