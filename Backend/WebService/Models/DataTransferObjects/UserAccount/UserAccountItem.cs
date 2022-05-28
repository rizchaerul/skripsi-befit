namespace WebService.Models.DataTransferObjects.UserAccount;

public class UserAccountItem
{
    public Guid Id { get; set; }

    public string? PictureBase64 { get; set; }

    public string Name { get; set; } = string.Empty;
}
