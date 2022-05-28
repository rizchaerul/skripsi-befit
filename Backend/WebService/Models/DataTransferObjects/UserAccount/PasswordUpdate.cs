using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.UserAccount;

public class PasswordUpdate
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    public string NewPassword { get; set; } = string.Empty;
}
