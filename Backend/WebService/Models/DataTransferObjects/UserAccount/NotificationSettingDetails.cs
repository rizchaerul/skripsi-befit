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

    [Required]
    public List<string> DrinkNotificationTimes { get; set; } = new();

    [Required]
    public List<string> WorkoutNotificationTimes { get; set; } = new();
}
