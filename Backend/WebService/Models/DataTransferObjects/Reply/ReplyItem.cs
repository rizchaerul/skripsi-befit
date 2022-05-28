namespace WebService.Models.DataTransferObjects.Reply;

public class ReplyItem
{
    public Guid Id { get; set; }

    public Guid UserAccountId { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? AvatarBase64 { get; set; }

    public string UserAccountName { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;
}
