using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

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
        [Column("drink_reminder_times")]
        public string[]? DrinkReminderTimes { get; set; }
        [Column("workout_reminder_times")]
        public string[]? WorkoutReminderTimes { get; set; }

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
    }
}
