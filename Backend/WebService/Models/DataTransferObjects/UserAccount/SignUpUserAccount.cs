using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.UserAccount;

public class SignUpUserAccount
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
