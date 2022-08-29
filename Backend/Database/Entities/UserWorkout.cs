using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("user_workout")]
    public partial class UserWorkout
    {
        public UserWorkout()
        {
            Posts = new HashSet<Post>();
            UserWorkoutDetails = new HashSet<UserWorkoutDetail>();
        }

        [Key]
        [Column("user_workout_id")]
        public Guid UserWorkoutId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("is_active")]
        public bool IsActive { get; set; }
        [Column("days")]
        public int[] Days { get; set; } = null!;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        [Column("progress_json")]
        public string? ProgressJson { get; set; }

        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("UserWorkouts")]
        public virtual UserAccount UserAccount { get; set; } = null!;
        [InverseProperty(nameof(Post.UserWorkout))]
        public virtual ICollection<Post> Posts { get; set; }
        [InverseProperty(nameof(UserWorkoutDetail.UserWorkout))]
        public virtual ICollection<UserWorkoutDetail> UserWorkoutDetails { get; set; }
    }
}
