using Database.Enums;

namespace WebService.Models.DataTransferObjects.Notification;

public class NotificationItem
{
    public Guid Id { get; set; }

    public bool IsRead { get; set; }

    public NotificationType TypeEnum { get; set; }

    public DateTime TimeStamp { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string? Url { get; set; }
}
