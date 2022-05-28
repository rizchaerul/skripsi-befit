namespace WebService.Models.DataTransferObjects.UserAccount;

public class UserAccountDetails
{
    public Guid UserAccountId { get; set; }

    public bool IsAdmin { get; set; }

    public string? PictureBase64 { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}
