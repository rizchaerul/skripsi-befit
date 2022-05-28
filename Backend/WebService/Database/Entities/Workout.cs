using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("workout")]
    public partial class Workout
    {
        public Workout()
        {
            UserWorkoutDetails = new HashSet<UserWorkoutDetail>();
            WorkoutProgresses = new HashSet<WorkoutProgress>();
        }

        [Key]
        [Column("workout_id")]
        public Guid WorkoutId { get; set; }
        [Column("workout_category_id")]
        public Guid WorkoutCategoryId { get; set; }
        [Column("name")]
        public string Name { get; set; } = null!;
        [Column("icon_base64")]
        public string? IconBase64 { get; set; }
        [Column("is_minute")]
        public bool IsMinute { get; set; }
        [Column("video_url")]
        public string? VideoUrl { get; set; }
        [Column("description")]
        public string? Description { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(WorkoutCategoryId))]
        [InverseProperty("Workouts")]
        public virtual WorkoutCategory WorkoutCategory { get; set; } = null!;
        [InverseProperty(nameof(UserWorkoutDetail.Workout))]
        public virtual ICollection<UserWorkoutDetail> UserWorkoutDetails { get; set; }
        [InverseProperty(nameof(WorkoutProgress.Workout))]
        public virtual ICollection<WorkoutProgress> WorkoutProgresses { get; set; }
    }
}
