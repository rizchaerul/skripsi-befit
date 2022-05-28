using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using WebService.Enums;
using WebService.Models.DataTransferObjects.Post;
using WebService.Models.Job;

namespace Database.Entities
{
    [Table("user_account")]
    [Index(nameof(Email), Name = "user_account_email_key", IsUnique = true)]
    public partial class UserAccount
    {
        public UserAccount()
        {
            Notifications = new HashSet<Notification>();
            PushNotifications = new HashSet<PushNotification>();
            Replies = new HashSet<Reply>();
            ReportProgresses = new HashSet<ReportProgress>();
            UserWorkouts = new HashSet<UserWorkout>();
            Votes = new HashSet<Vote>();
            WorkoutProgresses = new HashSet<WorkoutProgress>();
        }

        [Key]
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("full_name")]
        public string FullName { get; set; } = null!;
        [Column("email")]
        public string Email { get; set; } = null!;
        [Column("password")]
        public string Password { get; set; } = null!;
        [Column("picture_base64")]
        public string? PictureBase64 { get; set; }
        [Column("water_target")]
        public int WaterTarget { get; set; }
        [Column("per_glass")]
        public int PerGlass { get; set; }
        [Column("is_admin")]
        public bool IsAdmin { get; set; }
        [Column("weight_goal")]
        public decimal? WeightGoal { get; set; }
        [Column("fat_percentage_goal")]
        public decimal? FatPercentageGoal { get; set; }
        [Column("muscle_mass_goal")]
        public decimal? MuscleMassGoal { get; set; }
        [Required]
        [Column("is_reminder_notification_active")]
        public bool? IsReminderNotificationActive { get; set; }
        [Required]
        [Column("is_drink_notification_active")]
        public bool? IsDrinkNotificationActive { get; set; }
        [Required]
        [Column("is_comment_notification_active")]
        public bool? IsCommentNotificationActive { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [InverseProperty(nameof(Notification.UserAccount))]
        public virtual ICollection<Notification> Notifications { get; set; }
        [InverseProperty(nameof(PushNotification.UserAccount))]
        public virtual ICollection<PushNotification> PushNotifications { get; set; }
        [InverseProperty(nameof(Reply.UserAccount))]
        public virtual ICollection<Reply> Replies { get; set; }
        [InverseProperty(nameof(ReportProgress.UserAccount))]
        public virtual ICollection<ReportProgress> ReportProgresses { get; set; }
        [InverseProperty(nameof(UserWorkout.UserAccount))]
        public virtual ICollection<UserWorkout> UserWorkouts { get; set; }
        [InverseProperty(nameof(Vote.UserAccount))]
        public virtual ICollection<Vote> Votes { get; set; }
        [InverseProperty(nameof(WorkoutProgress.UserAccount))]
        public virtual ICollection<WorkoutProgress> WorkoutProgresses { get; set; }

        public async Task<PostList> GetOwnPosts(BeFitDbContext beFitDbContext, string url, Enums.PostCategory? category, PostSortType? sortType, Guid? userAccountId, int page = 1, int pageSize = 10)
        {
            var postsQuery = beFitDbContext.Posts
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
                    AvatarBase64 = $"{url}/api/image/profile/{p.UserWorkout.UserAccountId}",
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

        public async Task<PostList> GetFavoritePosts(BeFitDbContext beFitDbContext, string url, Guid? userAccountId, int page = 1, int pageSize = 10)
        {
            var postsQuery = beFitDbContext.Posts
                .Where(p => p.Votes.FirstOrDefault(v => v.UserAccountId == userAccountId) != null && p.Votes.FirstOrDefault(v => v.UserAccountId == userAccountId).IsUpvote);

            var totalPosts = await postsQuery
                .CountAsync();

            postsQuery = postsQuery
                .OrderByDescending(p => p.CreatedAt);

            var posts = await postsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostItem
                {
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
                    AvatarBase64 = $"{url}/api/image/profile/{p.UserWorkout.UserAccountId}",
                    UserWorkoutId = p.UserWorkoutId,
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

        public async Task<List<CheckDrinkModel>> CheckDrinkProgress(BeFitDbContext dbContext, DateOnly dateOnly)
        {
            // check drink progress
            var users = await dbContext.UserAccounts
                .Select(ua => new CheckDrinkModel
                {
                    UserAccountId = ua.UserAccountId,
                    Email = ua.Email,
                    DrinkTarget = ua.WaterTarget,
                    DrinkProgress = ua.ReportProgresses
                        .Where(rp => rp.ProgressCategoryId == (int)Database.Enums.ProgressCategory.Drink &&
                        rp.ProgressDate == dateOnly).FirstOrDefault()
                })
                .ToListAsync();

            return users;
        }
    }
}
