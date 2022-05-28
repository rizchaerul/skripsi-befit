using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.Workout;

public class WorkoutForm
{
    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    public bool IsMinute { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string VideoUrl { get; set; } = string.Empty;

    [Required]
    public string IconBase64 { get; set; } = string.Empty;
}
