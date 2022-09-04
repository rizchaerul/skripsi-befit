using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Database.Entities;
using Microsoft.EntityFrameworkCore;
using WebService.Constants;
using WebService.Services.Commons;

namespace WebService.Controllers
{
    public class JobController
    {
        private readonly BeFitDbContext _beFitDbContext;
        private readonly WebPushService _webPushService;

        public JobController(BeFitDbContext beFitDbContext, WebPushService webPushService)
        {
            _beFitDbContext = beFitDbContext;
            _webPushService = webPushService;
        }

        public async Task<string> NotifyUser()
        {
            var dateTime = DateTime.UtcNow;
            var hour = dateTime.Hour;
            var minute = dateTime.Minute;

            var isWorkout = true;
            var isDrink = true;

            if (isDrink)
            {
                var dateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

                var users = await new UserAccount().CheckDrinkProgress(_beFitDbContext, dateOnly);

                var userIds = new List<Guid>();

                var usersHours = await _beFitDbContext.UserAccounts
                    .Where(x => x.DrinkReminderTimes != null)
                    .Select(x => new { Times = x.DrinkReminderTimes, Id = x.UserAccountId })
                    .ToListAsync();

                foreach (var item in usersHours)
                {
                    foreach (var times in item.Times)
                    {
                        var hourLoop = int.Parse(times.Split(":")[0]);
                        var minuteLoop = int.Parse(times.Split(":")[1]);

                        if (hour == hourLoop && minute == minuteLoop)
                        {
                            userIds.Add(item.Id);
                        }
                    }
                }

                userIds = userIds.Distinct().ToList();

                users = users
                   .Where(u => (u.DrinkProgress?.Progress ?? 0) < u.DrinkTarget)
                   .Where(x => userIds.Contains(x.UserAccountId))
                   .ToList();

                foreach (var user in users)
                {
                    var pushNotifs = await _beFitDbContext.PushNotifications
                        .Where(pn => pn.UserAccountId == user.UserAccountId && pn.UserAccount.IsDrinkNotificationActive == true)
                        .ToListAsync();

                    _beFitDbContext.Add(new Notification
                    {
                        NotificationId = Guid.NewGuid(),
                        IsRead = false,
                        Message = $"Don't forget to drink, you haven't reach your target.",
                        NotificationTypeId = (int)Database.Enums.NotificationType.Drink,
                        Title = "Drink Reminder",
                        UserAccountId = user.UserAccountId,
                    });

                    foreach (var pushNotif in pushNotifs)
                    {
                        try
                        {
                            var dict = new Dictionary<string, string>
                            {
                                {"title", "Drink Reminder"},
                                {"message", "Don't forget to drink, you haven't reach your target."}
                            };

                            var json = JsonSerializer.Serialize(dict);

                            await _webPushService.PushNotification(json, pushNotif.Endpoint, pushNotif.P256dh, pushNotif.Auth);
                        }
                        catch
                        {
                            _beFitDbContext.Remove(pushNotif);
                        }
                    }
                }

                await _beFitDbContext.SaveChangesAsync();
            }

            if (isWorkout)
            {
                var userIds = new List<Guid>();

                var usersHours = await _beFitDbContext.UserAccounts
                    .Where(x => x.DrinkReminderTimes != null)
                    .Select(x => new { Times = x.WorkoutReminderTimes, Id = x.UserAccountId })
                    .ToListAsync();

                foreach (var item in usersHours)
                {
                    foreach (var times in item.Times)
                    {
                        var hourLoop = int.Parse(times.Split(":")[0]);
                        var minuteLoop = int.Parse(times.Split(":")[1]);

                        if (hour == hourLoop && minute == minuteLoop)
                        {
                            userIds.Add(item.Id);
                        }
                    }
                }

                userIds = userIds.Distinct().ToList();

                var dateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

                var users = await _beFitDbContext.UserAccounts
                    .Where(x => userIds.Contains(x.UserAccountId))
                    // .Where(ua => ua.UserWorkouts.Where(uw => uw.IsActive).)
                    .Select(ua => new
                    {
                        ua.UserAccountId,
                        Email = ua.Email,
                        UserWorkout = ua.UserWorkouts
                            .Where(uw => uw.IsActive)
                            .Select(uw => new
                            {
                                Workouts = uw.UserWorkoutDetails
                                    .Where(wd => wd.UserWorkout.Days.Contains((int)dateOnly.DayOfWeek))
                                    .Select(wd => new
                                    {
                                        Target = wd.Target,
                                        Progress = wd.Workout.WorkoutProgresses
                                            .Where(wp => wp.WorkoutDate == dateOnly)
                                            .Sum(wp => wp.Progress)
                                    })
                                    .Where(p => p.Progress < p.Target)
                            })
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                users = users
                   .Where(u => u.UserWorkout != null && u.UserWorkout.Workouts.Any())
                   .ToList();

                foreach (var user in users)
                {
                    var pushNotifs = await _beFitDbContext.PushNotifications
                        .Where(pn => pn.UserAccountId == user.UserAccountId && pn.UserAccount.IsReminderNotificationActive == true)
                        .ToListAsync();

                    _beFitDbContext.Add(new Notification
                    {
                        NotificationId = Guid.NewGuid(),
                        IsRead = false,
                        Message = $"You haven't reach your target!",
                        NotificationTypeId = (int)Database.Enums.NotificationType.Workout,
                        Title = "Workout Reminder",
                        UserAccountId = user.UserAccountId,
                    });

                    foreach (var pushNotif in pushNotifs)
                    {
                        try
                        {
                            var dict = new Dictionary<string, string>
                            {
                                {"title", "Workout Reminder"},
                                {"message", "You haven't reach your target!"}
                            };

                            var json = JsonSerializer.Serialize(dict);

                            await _webPushService.PushNotification(json, pushNotif.Endpoint, pushNotif.P256dh, pushNotif.Auth);
                        }
                        catch
                        {
                            _beFitDbContext.Remove(pushNotif);
                        }
                    }
                }

                await _beFitDbContext.SaveChangesAsync();

            }
            return "Success";
        }
    }
}
