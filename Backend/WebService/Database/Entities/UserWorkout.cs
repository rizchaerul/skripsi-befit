using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using WebService.Controllers;
using WebService.Constants;
using WebService.Models.DataTransferObjects.UserWorkout;
using WebService.Models.Reporting;
using WebService.Services;

namespace Database.Entities
{
    [Table("user_workout")]
    public partial class UserWorkout
    {
        public UserWorkout()
        {
            Posts = new HashSet<Post>();
            UserWorkoutDetails = new HashSet<UserWorkoutDetail>();
        }

        [Key]
        [Column("user_workout_id")]
        public Guid UserWorkoutId { get; set; }
        [Column("user_account_id")]
        public Guid UserAccountId { get; set; }
        [Column("is_active")]
        public bool IsActive { get; set; }
        [Column("days")]
        public int[] Days { get; set; } = null!;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        [Column("progress_json")]
        public string? ProgressJson { get; set; }

        [ForeignKey(nameof(UserAccountId))]
        [InverseProperty("UserWorkouts")]
        public virtual UserAccount UserAccount { get; set; } = null!;
        [InverseProperty(nameof(Post.UserWorkout))]
        public virtual ICollection<Post> Posts { get; set; }
        [InverseProperty(nameof(UserWorkoutDetail.UserWorkout))]
        public virtual ICollection<UserWorkoutDetail> UserWorkoutDetails { get; set; }

        public async Task AddWorkout(BeFitDbContext dbContext, Guid userAccountId, Guid workoutId, [Range(1, int.MaxValue)] int times = 1)
        {
            var userWorkout = await dbContext.UserWorkouts
                .Where(uw => uw.UserAccountId == userAccountId && uw.IsActive)
                .FirstOrDefaultAsync();

            if (userWorkout == null)
            {
                userWorkout = new UserWorkout
                {
                    UserWorkoutId = Guid.NewGuid(),
                    IsActive = true,
                    UserAccountId = userAccountId,
                    Days = Array.Empty<int>()
                };

                dbContext.Add(userWorkout);
            }

            dbContext.Add(new UserWorkoutDetail
            {
                UserWorkoutDetailId = Guid.NewGuid(),
                Target = times,
                UserWorkoutId = userWorkout.UserWorkoutId,
                WorkoutId = workoutId,
            });
        }

        public async Task AddManualWorkout(BeFitDbContext dbContext, UserWorkoutManualForm form)
        {
            var customCategory = await dbContext.WorkoutCategories
                .Where(wc => wc.Name == "Custom")
                .FirstOrDefaultAsync();

            var userWorkout = await dbContext.UserWorkouts
                .Where(uw => uw.UserAccountId == form.UserAccountId && uw.IsActive)
                .FirstOrDefaultAsync();

            if (customCategory == null)
            {
                throw new InvalidOperationException();
            }

            if (userWorkout == null)
            {
                userWorkout = new UserWorkout
                {
                    UserWorkoutId = Guid.NewGuid(),
                    IsActive = true,
                    UserAccountId = form.UserAccountId,
                    Days = Array.Empty<int>()
                };

                dbContext.Add(userWorkout);
            }

            var newWorkout = new Workout
            {
                WorkoutId = Guid.NewGuid(),
                WorkoutCategoryId = customCategory.WorkoutCategoryId,
                Unit = form.Unit,
                Name = form.WorkoutName,
            };

            dbContext.Add(newWorkout);

            var newWorkoutDetail = new UserWorkoutDetail
            {
                UserWorkoutDetailId = Guid.NewGuid(),
                UserWorkoutId = userWorkout.UserWorkoutId,
                WorkoutId = newWorkout.WorkoutId,
                Target = form.Repetition,
            };

            dbContext.Add(newWorkoutDetail);
        }

        public async Task SubmitDays(BeFitDbContext beFitDbContext, Guid identifier, int day)
        {
            var userWorkout = await beFitDbContext.UserWorkouts
                .AsTracking()
                .Where(uw => uw.UserAccountId == identifier && uw.IsActive)
                .FirstOrDefaultAsync();

            if (userWorkout == null)
            {
                throw new InvalidOperationException();
            }

            var days = userWorkout.Days.ToList();

            if (days.Contains(day))
            {
                days.Remove(day);
            }
            else
            {
                days.Add(day);
            }

            userWorkout.Days = days.ToArray();
            await beFitDbContext.SaveChangesAsync();
        }

        public async Task<List<int>> GetUserDays(BeFitDbContext beFitDbContext, Guid identifier)
        {
            var userWorkout = await beFitDbContext.UserWorkouts
                .Where(uw => uw.UserAccountId == identifier && uw.IsActive)
                .FirstOrDefaultAsync();

            if (userWorkout == null)
            {
                throw new InvalidOperationException();
            }

            return userWorkout.Days.ToList();
        }

        public async Task<Report> GetWorkoutReport(BeFitDbContext befitDbContext, Guid userId, DateTime date)
        {
            var userAccountId = userId;
            var dateOnly = DateOnly.FromDateTime(date.ToUniversalTime().AddHours(TimeOffsetConstants.TimeOffset));
            var today = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var currentDateOnly = new DateOnly(dateOnly.Year, dateOnly.Month, 1);
            var workouts = new List<UserWorkoutTemp>();

            var passed = 0;
            var failed = 0;

            while (currentDateOnly.Month == dateOnly.Month && currentDateOnly <= today)
            {
                var userWorkout = await befitDbContext.UserWorkouts
                    .Where(uw => uw.UserAccountId == userAccountId && uw.IsActive)
                    .Select(uw => new UserWorkoutTemp
                    {
                        Date = currentDateOnly.ToDateTime(new TimeOnly()),
                        IsOffDay = uw.Days.Contains((int)currentDateOnly.DayOfWeek) == false,
                        Workouts = uw.UserWorkoutDetails
                            .Where(wd => wd.UserWorkout.Days.Contains((int)currentDateOnly.DayOfWeek))
                            .Select(wd => new UserWorkoutTableItem
                            {
                                Id = wd.UserWorkoutDetailId,
                                Name = wd.Workout.Name,
                                Target = wd.Target,
                                Unit = UnitConvertService.ConvertUnitName(wd.Workout.Unit),
                                WorkoutId = wd.WorkoutId,

                                Progress = wd.Workout.WorkoutProgresses
                                    .Where(wp => wp.UserAccountId == userAccountId && wp.WorkoutDate == currentDateOnly)
                                    .Sum(wp => wp.Progress)
                            })
                            .ToList(),
                    })
                    .FirstOrDefaultAsync();

                if (userWorkout != null && userWorkout.IsOffDay == false && userWorkout.Workouts.Count != 0)
                {
                    passed += userWorkout.Workouts.Where(w => w.Progress >= w.Target).Count();
                    failed += userWorkout.Workouts.Where(w => w.Progress < w.Target).Count();

                    workouts.Add(userWorkout);
                }

                currentDateOnly = currentDateOnly.AddDays(1);
            }

            return new Report
            {
                Failed = failed,
                Passed = passed,
                Workouts = workouts,
            };
        }
    }
}
