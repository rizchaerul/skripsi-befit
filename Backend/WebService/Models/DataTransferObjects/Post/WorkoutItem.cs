namespace WebService.Models.DataTransferObjects.Post;

public class WorkoutItem
{
    public Guid Id { get; set; }

    public string Target { get; set; } = string.Empty;

    public string Progress { get; set; } = string.Empty;

    public string Unit { get; set; } = string.Empty;

    public Guid WorkoutId { get; set; }

    public string Name { get; set; } = string.Empty;
}
