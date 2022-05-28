using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("notification_type")]
    public partial class NotificationType
    {
        public NotificationType()
        {
            Notifications = new HashSet<Notification>();
        }

        [Key]
        [Column("notification_type_id")]
        public int NotificationTypeId { get; set; }
        [Column("name")]
        public string Name { get; set; } = null!;

        [InverseProperty(nameof(Notification.NotificationType))]
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
