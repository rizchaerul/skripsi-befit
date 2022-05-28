using System.Text.Json;
using Database.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebService.Constants;
using WebService.Services;
using WebService.Services.Commons;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class JobController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;
    private readonly WebPushService _webPushService;
    private readonly UserIdentityService _identityService;

    public JobController(BeFitDbContext db, WebPushService webPushService, UserIdentityService identityService)
    {
        _beFitDbContext = db;
        _webPushService = webPushService;
        _identityService = identityService;
    }

    [HttpGet]
    public async Task<ActionResult> TriggerNotification(bool isDrink)
    {
        if (!_identityService.IsApiKeyValid())
        {
            return Unauthorized();
        }

        if (isDrink)
        {
            var dateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var users = await new UserAccount().CheckDrinkProgress(_beFitDbContext, dateOnly);

            users = users
               .Where(u => (u.DrinkProgress?.Progress ?? 0) < u.DrinkTarget)
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

            return Ok(users.Select(u => new
            {
                Email = u.Email,
                UserId = u.UserAccountId,
                Target = u.DrinkTarget,
                Progress = u.DrinkProgress?.Progress ?? 0,
            }));
        }
        else
        {
            var dateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

            var users = await _beFitDbContext.UserAccounts
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

            return Ok(users);
        }
    }
}
