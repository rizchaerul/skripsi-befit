using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebService.Models.DataTransferObjects.Notification;
using WebService.Services.Commons;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class NotificationController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;

    public NotificationController(BeFitDbContext db)
    {
        _beFitDbContext = db;
    }

    [HttpGet("{userAccountId}/count")]
    public async Task<ActionResult<int>> GetCount(Guid userAccountId)
    {
        var notificationCount = await _beFitDbContext.Notifications
            .AsTracking()
            .Where(n => n.UserAccountId == userAccountId && n.IsRead == false)
            .CountAsync();

        return notificationCount;
    }

    [HttpGet("{userAccountId}")]
    public async Task<ActionResult<List<NotificationItem>>> Get(Guid userAccountId)
    {
        var notifications = await _beFitDbContext.Notifications
            .AsTracking()
            .Include(n => n.NotificationType)
            .Where(n => n.UserAccountId == userAccountId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        var mappedNotifications = notifications
            .Select(n => new NotificationItem
            {
                Id = n.NotificationId,
                Message = n.Message,
                Title = n.Title,
                Type = n.NotificationType.Name,
                TypeEnum = (Database.Enums.NotificationType)n.NotificationTypeId,
                IsRead = n.IsRead,
                TimeStamp = n.CreatedAt,
                Url = n.Url
            })
            .ToList();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }

        await _beFitDbContext.SaveChangesAsync();

        return mappedNotifications;
    }

    [HttpPost]
    public async Task<ActionResult> SaveNotificationData([FromHeader] Guid identifier, [FromQuery] string endpoint, [FromQuery] string p256dh, [FromQuery] string auth)
    {
        var alreadyExist = await _beFitDbContext.PushNotifications
            .Where(pn => pn.Endpoint == endpoint &&
                pn.P256dh == p256dh &&
                pn.Auth == auth)
            .AnyAsync();

        if (alreadyExist == false)
        {
            _beFitDbContext.Add(new PushNotification
            {
                PushNotificationId = Guid.NewGuid(),
                UserAccountId = identifier,
                Auth = auth,
                Endpoint = endpoint,
                P256dh = p256dh,
            });

            await _beFitDbContext.SaveChangesAsync();
        }


        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> DeletePushNotif([FromQuery] string endpoint, [FromQuery] string p256dh, [FromQuery] string auth)
    {
        var notif = await _beFitDbContext.PushNotifications
            .Where(pn => pn.Endpoint == endpoint &&
                pn.P256dh == p256dh &&
                pn.Auth == auth)
            .FirstOrDefaultAsync();

        if (notif != null)
        {
            _beFitDbContext.Remove(notif);
            await _beFitDbContext.SaveChangesAsync();
        }

        return Ok();
    }
}
