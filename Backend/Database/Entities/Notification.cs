using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("notification")]
    public partial class Notification
    {
        [Key]
        [Column("notification_id")]
        public Guid NotificationId { get; set; }
        [Column("notification_type_id")]
        public int NotificationTypeId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("url")]
        public string? Url { get; set; }
        [Column("title")]
        public string Title { get; set; } = null!;
        [Column("message")]
        public string Message { get; set; } = null!;
        [Column("is_read")]
        public bool IsRead { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(NotificationTypeId))]
        [InverseProperty("Notifications")]
        public virtual NotificationType NotificationType { get; set; } = null!;
        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("Notifications")]
        public virtual UserAccount UserAccount { get; set; } = null!;
    }
}
