namespace WebService.Models.DataTransferObjects.Post;

public class PostItem
{
    public Guid Id { get; set; }

    public Guid UserWorkoutId { get; set; }

    public Guid UserAccountId { get; set; }

    public int UpvoteCount { get; set; }

    public int DownvoteCount { get; set; }

    public int ReplyCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? AvatarBase64 { get; set; }

    public string Title { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public List<WorkoutItem> Workouts { get; set; } = new();
}
