using System.Security.Claims;
using System.Text.Json;
using Database.Entities;
using Database.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WebService.Enums;
using WebService.Models.DataTransferObjects.Post;
using WebService.Models.DataTransferObjects.Reply;
using WebService.Models.DataTransferObjects.Vote;
using WebService.Models.Settings;
using WebService.Services;
using WebService.Services.Commons;

using DbEnums = Database.Enums;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class PostController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;
    private readonly IOptions<WebApiSettings> _webApiSettings;
    private readonly WebPushService _webPushService;
    private readonly UserIdentityService _userIdentityService;


    public PostController(BeFitDbContext db, IOptions<WebApiSettings> webApiSettings, WebPushService webPushService, UserIdentityService userIdentityService)
    {
        _beFitDbContext = db;
        _webApiSettings = webApiSettings;
        _webPushService = webPushService;
        _userIdentityService = userIdentityService;
    }

    [HttpPost]
    public async Task<ActionResult> CreatePost([FromHeader] Guid identifier, [FromBody] PostForm form)
    {
        var userWorkout = await _beFitDbContext.UserWorkouts
            .Where(uw => uw.UserAccountId == identifier && uw.IsActive)
            .FirstOrDefaultAsync();

        if (userWorkout == null)
        {
            return BadRequest();
        }

        var newUserWorkout = new UserWorkout
        {
            UserWorkoutId = Guid.NewGuid(),
            Days = Array.Empty<int>(),
            IsActive = false,
            UserAccountId = userWorkout.UserAccountId,
        };

        _beFitDbContext.Add(newUserWorkout);

        var workoutDetails = await _beFitDbContext.UserWorkoutDetails
            .Where(uwd => uwd.UserWorkoutId == userWorkout.UserWorkoutId)
            .ToListAsync();

        foreach (var workoutDetail in workoutDetails)
        {
            _beFitDbContext.Add(new UserWorkoutDetail
            {
                UserWorkoutDetailId = Guid.NewGuid(),
                Target = workoutDetail.Target,
                UserWorkoutId = newUserWorkout.UserWorkoutId,
                WorkoutId = workoutDetail.WorkoutId,
            });
        }

        _beFitDbContext.Add(new Post
        {
            PostId = Guid.NewGuid(),
            Content = form.Description,
            PostCategoryId = (int)form.PostCategory,
            Title = form.Title,
            UserWorkoutId = newUserWorkout.UserWorkoutId,
        });

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> DeletePost(Guid postId)
    {
        var post = await _beFitDbContext.Posts
            .Where(p => p.PostId == postId)
            .FirstOrDefaultAsync();

        if (post != null)
        {
            // var comments = await _befitDbContext.Replies
            //     .Where(r => r.PostId == postId)
            //     .ToListAsync();

            // var votes = await _befitDbContext.Votes
            //     .Where(r => r.PostId == postId)
            //     .ToListAsync();

            // _befitDbContext.RemoveRange(comments);
            // _befitDbContext.RemoveRange(votes);
            _beFitDbContext.Remove(post);
            await _beFitDbContext.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<PostList>> GetPosts(DbEnums.PostCategory? category, PostSortType? sortType, Guid? userAccountId, int page = 1, int pageSize = 10)
    {
        var postsQuery = _beFitDbContext.Posts
            .Where(p => category == null || p.PostCategoryId == (int)category);

        var totalPosts = await postsQuery
            .Where(p => userAccountId == null || p.UserWorkout.UserAccountId == userAccountId)
            .CountAsync();

        if (sortType == null || sortType == PostSortType.New)
        {
            postsQuery = postsQuery
                .OrderByDescending(p => p.CreatedAt);
        }
        else if (sortType == PostSortType.Best)
        {
            postsQuery = postsQuery
                .OrderByDescending(p => p.Votes.Where(Q => Q.IsUpvote).Count());
        }

        var posts = await postsQuery
            .Where(p => userAccountId == null || p.UserWorkout.UserAccountId == userAccountId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PostItem
            {
                UserWorkoutId = p.UserWorkoutId,
                Id = p.PostId,
                Title = p.Title,
                UserName = p.UserWorkout.UserAccount.FullName,
                UpvoteCount = p.Votes.Where(Q => Q.IsUpvote).Count(),
                DownvoteCount = p.Votes.Where(Q => !Q.IsUpvote).Count(),
                ReplyCount = p.Replies.Count,
                CategoryName = p.PostCategory.Name,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                UserAccountId = p.UserWorkout.UserAccountId,
                AvatarBase64 = $"{_webApiSettings.Value.Url}/api/image/profile/{p.UserWorkout.UserAccountId}",
                Workouts = p.UserWorkout.UserWorkoutDetails
                    .Select(wd => new WorkoutItem
                    {
                        Id = wd.UserWorkoutDetailId,
                        Name = wd.Workout.Name,
                        Target = $"{wd.Target} {(wd.Workout.IsMinute ? "Minutes" : "Times")}"
                    })
                    .ToList()
            })
            .ToListAsync();

        var totalPages = (totalPosts + pageSize - 1) / pageSize;

        return new PostList
        {
            Posts = posts,
            TotalPages = totalPages,
        };
    }

    [HttpGet("{postId}/comments")]
    public async Task<ActionResult<List<ReplyItem>>> GetReplies([FromRoute] Guid postId)
    {
        var replies = await _beFitDbContext.Replies
            .Where(r => r.PostId == postId)
            .Select(r => new ReplyItem
            {
                Id = r.ReplyId,
                Content = r.Content,
                CreatedAt = r.CreatedAt,
                UserAccountId = r.UserAccountId,
                AvatarBase64 = $"{_webApiSettings.Value.Url}/api/image/profile/{r.UserAccountId}",
                UserAccountName = r.UserAccount.FullName,
            })
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();

        return replies;
    }

    [HttpGet("{postId}")]
    public async Task<ActionResult<PostItem>> GetPostById([FromRoute] Guid postId)
    {
        var result = await _beFitDbContext.Posts
            .Where(p => p.PostId == postId)
            .Select(p => new PostItem
            {
                Id = p.PostId,
                UserWorkoutId = p.UserWorkoutId,
                Title = p.Title,
                UserName = p.UserWorkout.UserAccount.FullName,
                UpvoteCount = p.Votes.Where(Q => Q.IsUpvote).Count(),
                DownvoteCount = p.Votes.Where(Q => !Q.IsUpvote).Count(),
                ReplyCount = p.Replies.Count,
                CategoryName = p.PostCategory.Name,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                UserAccountId = p.UserWorkout.UserAccountId,
                AvatarBase64 = $"{_webApiSettings.Value.Url}/api/image/profile/{p.UserWorkout.UserAccountId}",
                Workouts = p.UserWorkout.UserWorkoutDetails
                    .Select(wd => new WorkoutItem
                    {
                        Id = wd.UserWorkoutDetailId,
                        Name = wd.Workout.Name,
                        Target = $"{wd.Target} {(wd.Workout.IsMinute ? "Minutes" : "Times")}"
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (result == null)
        {
            return NotFound();
        }

        return result;
    }

    [HttpPost("{postId}/comment")]
    public async Task<ActionResult> PostComment([FromRoute] Guid postId, [FromBody] ReplyForm form)
    {
        var newReply = new Reply
        {
            ReplyId = Guid.NewGuid(),
            Content = form.Comment,
            CreatedAt = DateTime.UtcNow,
            PostId = postId,
            UserAccountId = form.UserAccountId,
        };

        _beFitDbContext.Add(newReply);

        var post = await _beFitDbContext.Posts
            .Where(p => p.PostId == postId)
            .Include(p => p.UserWorkout)
            .Include(p => p.UserWorkout.UserAccount)
            .FirstOrDefaultAsync();

        if (form.UserAccountId != post?.UserWorkout.UserAccountId)
        {
            var pushNotifs = await _beFitDbContext.PushNotifications
                .Where(pn => pn.UserAccountId == post.UserWorkout.UserAccountId && pn.UserAccount.IsCommentNotificationActive == true)
                .ToListAsync();

            var fullName = await _beFitDbContext.UserAccounts
                .Where(ua => ua.UserAccountId == form.UserAccountId)
                .Select(ua => ua.FullName)
                .FirstOrDefaultAsync();

            _beFitDbContext.Add(new Notification
            {
                NotificationId = Guid.NewGuid(),
                IsRead = false,
                Message = $"{fullName} has commented on your post!",
                NotificationTypeId = (int)DbEnums.NotificationType.Comment,
                Title = "New Comment",
                Url = postId.ToString(),
                UserAccountId = post?.UserWorkout.UserAccountId ?? Guid.NewGuid(),
            });

            await _beFitDbContext.SaveChangesAsync();

            foreach (var pushNotif in pushNotifs)
            {
                try
                {
                    var dict = new Dictionary<string, string>
                    {
                        {"title", "New Comment"},
                        {"message", $"{fullName} has commented on your post!"}
                    };

                    var json = JsonSerializer.Serialize(dict);

                    await _webPushService.PushNotification(json, pushNotif.Endpoint, pushNotif.P256dh, pushNotif.Auth);
                }
                catch
                {

                }
            }
        }
        else
        {
            await _beFitDbContext.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpGet("vote/{postId}")]
    public async Task<ActionResult<PostDetails>> GetVote([FromRoute] Guid postId, Guid userAccountId)
    {
        var vote = await _beFitDbContext.Posts
            .Where(p => p.PostId == postId)
            .Select(p => new
            {
                UpvoteCount = p.Votes.Where(Q => Q.IsUpvote).Count(),
                DownvoteCount = p.Votes.Where(Q => !Q.IsUpvote).Count(),
                Vote = p.Votes.Where(v => v.UserAccountId == userAccountId).FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (vote == null)
        {
            return NotFound();
        }

        return new PostDetails
        {
            UpvoteCount = vote.UpvoteCount,
            DownvoteCount = vote.DownvoteCount,
            IsDisliked = vote.Vote != null && vote.Vote.IsUpvote == false,
            IsLiked = vote.Vote?.IsUpvote ?? default,
        };
    }

    [HttpPost("vote/{postId}")]
    // TODO: TEST
    public async Task<ActionResult> SubmitVote([FromRoute] Guid postId, [FromBody] SubmitVote form)
    {
        var existingVote = await _beFitDbContext.Votes
            .AsTracking()
            .FirstOrDefaultAsync(v => v.PostId == postId && v.UserAccountId == form.UserAccountId);

        if (existingVote == null)
        {
            _beFitDbContext.Add(new Vote
            {
                PostId = postId,
                UserAccountId = form.UserAccountId,
                IsUpvote = form.VoteType == VoteType.UpVote
            });
        }
        else
        {
            if (existingVote.IsUpvote == (form.VoteType == VoteType.UpVote))
            {
                _beFitDbContext.Remove(existingVote);
            }
            else
            {
                existingVote.IsUpvote = form.VoteType == VoteType.UpVote;
            }
        }

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("copy")]
    public async Task<ActionResult> CopyWorkout(Guid source)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();

        var dest = await _beFitDbContext.UserWorkouts
            .Where(uw => uw.UserAccountId == userAccountId && uw.IsActive)
            .Select(uw => uw.UserWorkoutId)
            .FirstOrDefaultAsync();

        var userWorkoutDetails = await _beFitDbContext.UserWorkoutDetails
            .Where(uw => uw.UserWorkoutId == source)
            .ToListAsync();

        var userWorkoutDestDetails = await _beFitDbContext.UserWorkoutDetails
            .Where(uw => uw.UserWorkoutId == dest)
            .ToListAsync();

        _beFitDbContext.RemoveRange(userWorkoutDestDetails);

        foreach (var userWorkoutDetail in userWorkoutDetails)
        {
            _beFitDbContext.Add(new UserWorkoutDetail
            {
                UserWorkoutDetailId = Guid.NewGuid(),
                Target = userWorkoutDetail.Target,
                UserWorkoutId = dest,
                WorkoutId = userWorkoutDetail.WorkoutId,
            });
        }

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }
}
