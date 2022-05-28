using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.UserAccount;

public class NotificationSettingDetails
{
    [Required]
    public bool IsReminderNotificationActive { get; set; }

    [Required]
    public bool IsCommentNotificationActive { get; set; }

    [Required]
    public bool IsDrinkNotificationActive { get; set; }
}
