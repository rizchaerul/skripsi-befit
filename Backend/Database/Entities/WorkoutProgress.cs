using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("workout_progress")]
    public partial class WorkoutProgress
    {
        [Key]
        [Column("workout_progress_id")]
        public Guid WorkoutProgressId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("workout_id")]
        public Guid WorkoutId { get; set; }
        [Column("progress")]
        public int Progress { get; set; }
        [Column("workout_date")]
        public DateOnly WorkoutDate { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("WorkoutProgresses")]
        public virtual UserAccount UserAccount { get; set; } = null!;
        [ForeignKey(nameof(WorkoutId))]
        [InverseProperty("WorkoutProgresses")]
        public virtual Workout Workout { get; set; } = null!;
    }
}
