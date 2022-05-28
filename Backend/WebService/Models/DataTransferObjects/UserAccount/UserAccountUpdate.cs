using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.UserAccount;

public class UserAccountUpdate
{
    public string? PictureBase64 { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;
}
