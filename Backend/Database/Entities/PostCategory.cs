using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("post_category")]
    public partial class PostCategory
    {
        public PostCategory()
        {
            Posts = new HashSet<Post>();
        }

        [Key]
        [Column("post_category_id")]
        public int PostCategoryId { get; set; }
        [Column("name")]
        public string Name { get; set; } = null!;

        [InverseProperty(nameof(Post.PostCategory))]
        public virtual ICollection<Post> Posts { get; set; }
    }
}
