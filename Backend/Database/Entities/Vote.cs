using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("vote")]
    public partial class Vote
    {
        [Key]
        [Column("post_id")]
        public Guid PostId { get; set; }
        [Key]
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("is_upvote")]
        public bool IsUpvote { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(PostId))]
        [InverseProperty("Votes")]
        public virtual Post Post { get; set; } = null!;
        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("Votes")]
        public virtual UserAccount UserAccount { get; set; } = null!;
    }
}
