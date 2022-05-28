using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("push_notification")]
    public partial class PushNotification
    {
        [Key]
        [Column("push_notification_id")]
        public Guid PushNotificationId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("endpoint")]
        public string Endpoint { get; set; } = null!;
        [Column("p256dh")]
        public string P256dh { get; set; } = null!;
        [Column("auth")]
        public string Auth { get; set; } = null!;

        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("PushNotifications")]
        public virtual UserAccount UserAccount { get; set; } = null!;
    }
}
