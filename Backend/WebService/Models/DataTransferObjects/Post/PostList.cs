namespace WebService.Models.DataTransferObjects.Post;


public class PostList
{
    public int TotalPages { get; set; }

    public List<PostItem> Posts { get; set; } = new();
}
