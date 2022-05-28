using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("user_workout_detail")]
    [Index(nameof(UserWorkoutId), nameof(WorkoutId), Name = "user_workout_detail_user_workout_id_workout_id_key", IsUnique = true)]
    public partial class UserWorkoutDetail
    {
        [Key]
        [Column("user_workout_detail_id")]
        public Guid UserWorkoutDetailId { get; set; }
        [Column("user_workout_id")]
        public Guid UserWorkoutId { get; set; }
        [Column("workout_id")]
        public Guid WorkoutId { get; set; }
        [Column("target")]
        public int Target { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(UserWorkoutId))]
        [InverseProperty("UserWorkoutDetails")]
        public virtual UserWorkout UserWorkout { get; set; } = null!;
        [ForeignKey(nameof(WorkoutId))]
        [InverseProperty("UserWorkoutDetails")]
        public virtual Workout Workout { get; set; } = null!;
    }
}
