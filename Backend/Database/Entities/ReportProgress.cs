using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("report_progress")]
    public partial class ReportProgress
    {
        [Key]
        [Column("report_progress_id")]
        public Guid ReportProgressId { get; set; }
        [Column("progress_category_id")]
        public int ProgressCategoryId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("progress")]
        public decimal Progress { get; set; }
        [Column("progress_date")]
        public DateOnly ProgressDate { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(ProgressCategoryId))]
        [InverseProperty("ReportProgresses")]
        public virtual ProgressCategory ProgressCategory { get; set; } = null!;
        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("ReportProgresses")]
        public virtual UserAccount UserAccount { get; set; } = null!;
    }
}
