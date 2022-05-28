using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Database.Entities
{
    [Table("progress_category")]
    public partial class ProgressCategory
    {
        public ProgressCategory()
        {
            ReportProgresses = new HashSet<ReportProgress>();
        }

        [Key]
        [Column("progress_category_id")]
        public int ProgressCategoryId { get; set; }
        [Column("name")]
        public string Name { get; set; } = null!;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [InverseProperty(nameof(ReportProgress.ProgressCategory))]
        public virtual ICollection<ReportProgress> ReportProgresses { get; set; }
    }
}
