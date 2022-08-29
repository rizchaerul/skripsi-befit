using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.UserWorkout;

public class UserWorkoutManualForm
{
    [Required]
    public string WorkoutName { get; set; } = string.Empty;

    [Required]
    public string Unit { get; set; } = string.Empty;

    [Required]
    public int Repetition { get; set; }

    [Required]
    public Guid UserAccountId { get; set; }
}
