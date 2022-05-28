namespace WebService.Models.DataTransferObjects.Workout;

public class WorkoutItem
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string IconBase64 { get; set; } = string.Empty;

    public string Times { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;
}
