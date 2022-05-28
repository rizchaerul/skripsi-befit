namespace WebService.Models.DataTransferObjects.Post;

public class WorkoutItem
{
    public Guid Id { get; set; }

    public string Target { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;
}
