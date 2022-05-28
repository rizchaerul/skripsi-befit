using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("workout_category")]
    public partial class WorkoutCategory
    {
        public WorkoutCategory()
        {
            Workouts = new HashSet<Workout>();
        }

        [Key]
        [Column("workout_category_id")]
        public Guid WorkoutCategoryId { get; set; }
        [Column("name")]
        public string Name { get; set; } = null!;
        [Column("is_hidden")]
        public bool IsHidden { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [InverseProperty(nameof(Workout.WorkoutCategory))]
        public virtual ICollection<Workout> Workouts { get; set; }
    }
}
