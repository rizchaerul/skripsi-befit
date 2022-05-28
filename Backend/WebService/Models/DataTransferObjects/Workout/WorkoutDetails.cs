namespace WebService.Models.DataTransferObjects.Workout;

public class WorkoutDetails
{
    public Guid CategoryId { get; set; }

    public bool IsMinute { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string VideoUrl { get; set; } = string.Empty;

    public string IconBase64 { get; set; } = string.Empty;
}
