namespace WebService.Models.DataTransferObjects.Post;

public class PostDetails
{
    public bool IsLiked { get; set; }

    public bool IsDisliked { get; set; }

    public int UpvoteCount { get; set; }

    public int DownvoteCount { get; set; }
}
