using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("post")]
    public partial class Post
    {
        public Post()
        {
            Replies = new HashSet<Reply>();
            Votes = new HashSet<Vote>();
        }

        [Key]
        [Column("post_id")]
        public Guid PostId { get; set; }
        [Column("post_category_id")]
        public int PostCategoryId { get; set; }
        [Column("user_workout_id")]
        public Guid UserWorkoutId { get; set; }
        [Column("title")]
        public string Title { get; set; } = null!;
        [Column("content")]
        public string Content { get; set; } = null!;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(PostCategoryId))]
        [InverseProperty("Posts")]
        public virtual PostCategory PostCategory { get; set; } = null!;
        [ForeignKey(nameof(UserWorkoutId))]
        [InverseProperty("Posts")]
        public virtual UserWorkout UserWorkout { get; set; } = null!;
        [InverseProperty(nameof(Reply.Post))]
        public virtual ICollection<Reply> Replies { get; set; }
        [InverseProperty(nameof(Vote.Post))]
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
