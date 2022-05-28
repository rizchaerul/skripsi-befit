using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Database.Entities
{
    public partial class BeFitDbContext : DbContext
    {
        public BeFitDbContext(DbContextOptions<BeFitDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Notification> Notifications { get; set; } = null!;
        public virtual DbSet<NotificationType> NotificationTypes { get; set; } = null!;
        public virtual DbSet<Post> Posts { get; set; } = null!;
        public virtual DbSet<PostCategory> PostCategories { get; set; } = null!;
        public virtual DbSet<ProgressCategory> ProgressCategories { get; set; } = null!;
        public virtual DbSet<PushNotification> PushNotifications { get; set; } = null!;
        public virtual DbSet<Reply> Replies { get; set; } = null!;
        public virtual DbSet<ReportProgress> ReportProgresses { get; set; } = null!;
        public virtual DbSet<UserAccount> UserAccounts { get; set; } = null!;
        public virtual DbSet<UserWorkout> UserWorkouts { get; set; } = null!;
        public virtual DbSet<UserWorkoutDetail> UserWorkoutDetails { get; set; } = null!;
        public virtual DbSet<Vote> Votes { get; set; } = null!;
        public virtual DbSet<Workout> Workouts { get; set; } = null!;
        public virtual DbSet<WorkoutCategory> WorkoutCategories { get; set; } = null!;
        public virtual DbSet<WorkoutProgress> WorkoutProgresses { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.NotificationId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.NotificationType)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.NotificationTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("notification_notification_type_id_fkey");

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("notification_user_account_id_fkey");
            });

            modelBuilder.Entity<NotificationType>(entity =>
            {
                entity.Property(e => e.NotificationTypeId).ValueGeneratedNever();
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(e => e.PostId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.PostCategory)
                    .WithMany(p => p.Posts)
                    .HasForeignKey(d => d.PostCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("post_post_category_id_fkey");

                entity.HasOne(d => d.UserWorkout)
                    .WithMany(p => p.Posts)
                    .HasForeignKey(d => d.UserWorkoutId)
                    .HasConstraintName("post_user_workout_id_fkey");
            });

            modelBuilder.Entity<PostCategory>(entity =>
            {
                entity.Property(e => e.PostCategoryId).ValueGeneratedNever();
            });

            modelBuilder.Entity<ProgressCategory>(entity =>
            {
                entity.Property(e => e.ProgressCategoryId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<PushNotification>(entity =>
            {
                entity.Property(e => e.PushNotificationId).ValueGeneratedNever();

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.PushNotifications)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("push_notification_user_account_id_fkey");
            });

            modelBuilder.Entity<Reply>(entity =>
            {
                entity.Property(e => e.ReplyId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Post)
                    .WithMany(p => p.Replies)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("reply_post_id_fkey");

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.Replies)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("reply_user_account_id_fkey");
            });

            modelBuilder.Entity<ReportProgress>(entity =>
            {
                entity.Property(e => e.ReportProgressId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.ProgressCategory)
                    .WithMany(p => p.ReportProgresses)
                    .HasForeignKey(d => d.ProgressCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("report_progress_progress_category_id_fkey");

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.ReportProgresses)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("report_progress_user_account_id_fkey");
            });

            modelBuilder.Entity<UserAccount>(entity =>
            {
                entity.Property(e => e.UserAccountId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.IsCommentNotificationActive).HasDefaultValueSql("true");

                entity.Property(e => e.IsDrinkNotificationActive).HasDefaultValueSql("true");

                entity.Property(e => e.IsReminderNotificationActive).HasDefaultValueSql("true");
            });

            modelBuilder.Entity<UserWorkout>(entity =>
            {
                entity.Property(e => e.UserWorkoutId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.UserWorkouts)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("user_workout_user_account_id_fkey");
            });

            modelBuilder.Entity<UserWorkoutDetail>(entity =>
            {
                entity.Property(e => e.UserWorkoutDetailId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.UserWorkout)
                    .WithMany(p => p.UserWorkoutDetails)
                    .HasForeignKey(d => d.UserWorkoutId)
                    .HasConstraintName("user_workout_detail_user_workout_id_fkey");

                entity.HasOne(d => d.Workout)
                    .WithMany(p => p.UserWorkoutDetails)
                    .HasForeignKey(d => d.WorkoutId)
                    .HasConstraintName("user_workout_detail_workout_id_fkey");
            });

            modelBuilder.Entity<Vote>(entity =>
            {
                entity.HasKey(e => new { e.UserAccountId, e.PostId })
                    .HasName("vote_pkey");

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Post)
                    .WithMany(p => p.Votes)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("vote_post_id_fkey");

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.Votes)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("vote_user_account_id_fkey");
            });

            modelBuilder.Entity<Workout>(entity =>
            {
                entity.Property(e => e.WorkoutId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.WorkoutCategory)
                    .WithMany(p => p.Workouts)
                    .HasForeignKey(d => d.WorkoutCategoryId)
                    .HasConstraintName("workout_workout_category_id_fkey");
            });

            modelBuilder.Entity<WorkoutCategory>(entity =>
            {
                entity.Property(e => e.WorkoutCategoryId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<WorkoutProgress>(entity =>
            {
                entity.Property(e => e.WorkoutProgressId).ValueGeneratedNever();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.UserAccount)
                    .WithMany(p => p.WorkoutProgresses)
                    .HasForeignKey(d => d.UserAccountId)
                    .HasConstraintName("workout_progress_user_account_id_fkey");

                entity.HasOne(d => d.Workout)
                    .WithMany(p => p.WorkoutProgresses)
                    .HasForeignKey(d => d.WorkoutId)
                    .HasConstraintName("workout_progress_workout_id_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

