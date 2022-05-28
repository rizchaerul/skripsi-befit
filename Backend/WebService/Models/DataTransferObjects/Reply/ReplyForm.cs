using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.Reply;

public class ReplyForm
{
    public Guid UserAccountId { get; set; }

    [Required]
    public string Comment { get; set; } = string.Empty;
}
