using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("reply")]
    public partial class Reply
    {
        [Key]
        [Column("reply_id")]
        public Guid ReplyId { get; set; }
        [Column("post_id")]
        public Guid PostId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("content")]
        public string Content { get; set; } = null!;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(PostId))]
        [InverseProperty("Replies")]
        public virtual Post Post { get; set; } = null!;
        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("Replies")]
        public virtual UserAccount UserAccount { get; set; } = null!;
    }
}
