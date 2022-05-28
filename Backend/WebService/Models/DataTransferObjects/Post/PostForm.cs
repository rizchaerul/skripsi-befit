using System.ComponentModel.DataAnnotations;
using Database.Enums;

namespace WebService.Models.DataTransferObjects.Post;

public class PostForm
{
    [Required]
    public PostCategory PostCategory { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;
}
