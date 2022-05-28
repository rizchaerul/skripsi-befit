using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using WebService.Constants;
using WebService.Controllers;
using WebService.Models.DataTransferObjects.DrinkReport;
using WebService.Models.DataTransferObjects.HeightReport;
using WebService.Models.Reporting;

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

        public async Task<List<DrinkReportChartItem>> GetDrinkChart(BeFitDbContext beFitDbContext, Guid userAccountId, DateTime month)
        {
            month = month.ToUniversalTime().AddHours(TimeOffsetConstants.TimeOffset);
            var currentDateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var progress = await beFitDbContext.ReportProgresses
               .AsTracking()
               .Where(wp => wp.ProgressCategoryId == (int)Database.Enums.ProgressCategory.Drink &&
                    wp.UserAccountId == userAccountId &&
                    wp.ProgressDate.Year == month.Year &&
                    wp.ProgressDate.Month == month.Month)
                .Select(p => new DrinkReportChartItem
                {
                    Date = p.ProgressDate.ToDateTime(new TimeOnly()),
                    Progress = (int)p.Progress,
                    Target = p.UserAccount.WaterTarget,
                    Pass = p.Progress >= p.UserAccount.WaterTarget,
                })
               .ToListAsync();

            var dateIndex = new DateOnly(month.Year, month.Month, 1);

            while (dateIndex.Month == month.Month && dateIndex <= currentDateOnly)
            {
                var progressDay = progress
                    .Where(p => DateOnly.FromDateTime(p.Date) == dateIndex)
                    .FirstOrDefault();

                if (progressDay == null)
                {
                    progress.Add(new DrinkReportChartItem
                    {
                        Date = dateIndex.ToDateTime(new TimeOnly()),
                        Progress = 0,
                        Target = progress.FirstOrDefault()?.Target ?? 0,
                        Pass = false,
                    });
                }

                dateIndex = dateIndex.AddDays(1);
            }

            progress = progress
                .OrderBy(p => p.Date)
                .ToList();

            return progress;
        }

        public async Task<DrinkReportDetail> GetDrinkReport(BeFitDbContext befitDbContext, Guid userAccountId)
        {
            var currentDateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var progress = await befitDbContext.ReportProgresses
               .AsTracking()
               .Where(wp => wp.ProgressCategoryId == (int)Database.Enums.ProgressCategory.Drink &&
                    wp.UserAccountId == userAccountId &&
                    wp.ProgressDate == currentDateOnly)
                .Select(p => new DrinkReportDetail
                {
                    Progress = (int)p.Progress,
                })
               .FirstOrDefaultAsync();

            var userAccount = await befitDbContext.UserAccounts
                .Where(ua => ua.UserAccountId == userAccountId)
                .FirstOrDefaultAsync();

            return new DrinkReportDetail
            {
                PerGlass = userAccount?.PerGlass ?? default,
                Progress = progress?.Progress ?? default,
                Target = userAccount?.WaterTarget ?? default,
            };
        }

        public async Task<CurrentReport> GetCurrentReport(BeFitDbContext befitDbContext, Guid userAccountId, Enums.ProgressCategory category)
        {
            var progress = await befitDbContext.ReportProgresses
                .Where(wp => wp.ProgressCategoryId == (int)category &&
                    wp.UserAccountId == userAccountId)
                .OrderByDescending(wp => wp.ProgressDate)
                .FirstOrDefaultAsync();

            var userAccount = await befitDbContext.UserAccounts
                .Where(ua => ua.UserAccountId == userAccountId)
                .FirstOrDefaultAsync();

            decimal? target = 0;

            if (category == Enums.ProgressCategory.Weight)
            {
                target = userAccount?.WeightGoal;
            }
            else if (category == Enums.ProgressCategory.FatPercentage)
            {
                target = userAccount?.FatPercentageGoal;
            }
            else if (category == Enums.ProgressCategory.MuscleMass)
            {
                target = userAccount?.MuscleMassGoal;
            }

            return new CurrentReport
            {
                Current = progress?.Progress,
                Target = target,
            };
        }

        public async Task<decimal> GetLastHeight(BeFitDbContext befitDbContext, Guid userAccountId)
        {
            var progress = await befitDbContext.ReportProgresses
                .AsTracking()
                .Where(wp => wp.ProgressCategoryId == (int)Database.Enums.ProgressCategory.Height &&
                    wp.UserAccountId == userAccountId)
                .OrderByDescending(wp => wp.ProgressDate)
                .FirstOrDefaultAsync();

            var progressDec = progress?.Progress;

            if (progressDec != null)
            {
                return progressDec ?? 0;
            }

            return 0;
        }

        public async Task<List<HeightReportItem>> GetChartData(BeFitDbContext befitDbContext, Guid userAccountId, DateTime year, Enums.ProgressCategory category = Enums.ProgressCategory.Height)
        {
            year = year.ToUniversalTime().AddHours(TimeOffsetConstants.TimeOffset);
            var currentDateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var progresses = await befitDbContext.ReportProgresses
                .Where(wp => wp.ProgressCategoryId == (int)category &&
                    wp.UserAccountId == userAccountId &&
                    wp.ProgressDate.Year == year.Year)
                .Select(p => new HeightReportItem
                {
                    Month = p.ProgressDate.Month,
                    Progress = p.Progress,
                })
                .ToListAsync();

            var progress = progresses
                    .Where(p => p.Month == 1)
                    .FirstOrDefault();

            if (progress == null)
            {
                var lastYearProgress = await befitDbContext.ReportProgresses
                    .Where(wp => wp.ProgressCategoryId == (int)category &&
                        wp.UserAccountId == userAccountId &&
                        wp.ProgressDate.Year < year.Year)
                    .OrderByDescending(wp => wp.ProgressDate)
                    .Select(p => new HeightReportItem
                    {
                        Month = p.ProgressDate.Month,
                        Progress = p.Progress,
                    })
                    .FirstOrDefaultAsync();

                if (lastYearProgress != null)
                {
                    progresses.Add(new HeightReportItem
                    {
                        Month = 1,
                        Progress = lastYearProgress.Progress,
                    });
                }
                else
                {
                    progresses.Add(new HeightReportItem
                    {
                        Month = 1,
                        Progress = 0,
                    });
                }
            }

            var lastProgress = progresses
                .Where(p => p.Month == 1)
                .FirstOrDefault();

            for (int i = 0; i < 12; i++)
            {
                var month = i + 1;

                progress = progresses
                   .Where(p => p.Month == month)
                   .FirstOrDefault();

                if (progress == null)
                {
                    progresses.Add(new HeightReportItem
                    {
                        Month = month,
                        Progress = lastProgress?.Progress ?? 0,
                    });
                }
                else
                {
                    lastProgress = progress;
                }
            }

            if (year.Year == currentDateOnly.Year)
            {
                progresses = progresses
                    .Where(p => p.Month <= currentDateOnly.Month)
                    .ToList();
            }

            progresses = progresses
                .OrderBy(p => p.Month)
                .ToList();

            return progresses;
        }

        public async Task AddDrinkProgress(BeFitDbContext context, Guid userAccountId, int glass)
        {
            var currentDateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var progress = await context.ReportProgresses
               .AsTracking()
               .Where(wp => wp.ProgressCategoryId == (int)Database.Enums.ProgressCategory.Drink &&
                    wp.UserAccountId == userAccountId &&
                    wp.ProgressDate == currentDateOnly)
               .FirstOrDefaultAsync();

            if (glass < 0)
            {
                glass = 0;
            }

            if (progress == null)
            {
                context.Add(new ReportProgress
                {
                    ReportProgressId = Guid.NewGuid(),
                    ProgressCategoryId = (int)Database.Enums.ProgressCategory.Drink,
                    UserAccountId = userAccountId,
                    Progress = glass,
                    ProgressDate = currentDateOnly,
                });
            }
            else
            {
                progress.Progress = glass;
            }
        }

        public async Task SetDrinkTarget(BeFitDbContext context, Guid userAccountId, int perGlass, int totalGlass)
        {
            var user = await context.UserAccounts
                .AsTracking()
                .Where(ua => ua.UserAccountId == userAccountId)
                .FirstOrDefaultAsync();

            if (user != null)
            {
                user.WaterTarget = totalGlass;
                user.PerGlass = perGlass;
            }
        }

        public async Task SetReportTarget(BeFitDbContext context, Guid userAccountId, Enums.ProgressCategory category, decimal target)
        {
            var userAccount = await context.UserAccounts
                .AsTracking()
                .Where(ua => ua.UserAccountId == userAccountId)
                .FirstOrDefaultAsync();

            if (userAccount != null)
            {
                if (category == Database.Enums.ProgressCategory.Weight)
                {
                    userAccount.WeightGoal = target;
                }
                else if (category == Database.Enums.ProgressCategory.FatPercentage)
                {
                    userAccount.FatPercentageGoal = target;
                }
                else if (category == Database.Enums.ProgressCategory.MuscleMass)
                {
                    userAccount.MuscleMassGoal = target;
                }
            }
        }

        public async Task InsertReportData(BeFitDbContext context, Guid userAccountId, Enums.ProgressCategory category, decimal progressReq)
        {
            var currentDateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var progress = await context.ReportProgresses
               .AsTracking()
               .Where(wp => wp.ProgressCategoryId == (int)category &&
                    wp.UserAccountId == userAccountId &&
                    wp.ProgressDate.Month == currentDateOnly.Month &&
                    wp.ProgressDate.Year == currentDateOnly.Year)
               .FirstOrDefaultAsync();

            if (progressReq < 0)
            {
                progressReq = 0;
            }

            if (progress == null)
            {
                context.ReportProgresses.Add(new ReportProgress
                {
                    ReportProgressId = Guid.NewGuid(),
                    ProgressCategoryId = (int)category,
                    UserAccountId = userAccountId,
                    Progress = progressReq,
                    ProgressDate = currentDateOnly,
                });
            }
            else
            {
                progress.Progress = progressReq;
            }
        }
    }
}
