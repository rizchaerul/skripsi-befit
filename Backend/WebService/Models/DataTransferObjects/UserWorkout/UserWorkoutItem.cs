namespace WebService.Models.DataTransferObjects.UserWorkout;

public class UserWorkoutItem
{
    public Guid Id { get; set; }

    public string? Description { get; set; }

    public string IconBase64 { get; set; } = string.Empty;
}
