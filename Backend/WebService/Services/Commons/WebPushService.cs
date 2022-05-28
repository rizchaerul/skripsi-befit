using Microsoft.Extensions.Options;
using WebPush;
using WebService.Models.Settings;

namespace WebService.Services.Commons;

/// <summary>
/// Service class that handles web push notification.
/// </summary>
public class WebPushService
{
    private readonly WebPushClient _webPushClient;
    private readonly Dictionary<string, object> _options;

    public WebPushService(IOptions<VapidSettings> vapidSettings)
    {
        var vapidSettingValues = vapidSettings.Value;
        _options = new Dictionary<string, object>
        {
            ["vapidDetails"] = new VapidDetails(vapidSettingValues.Subject, vapidSettingValues.PublicKey, vapidSettingValues.PrivateKey)
        };

        _webPushClient = new WebPushClient();
    }

    /// <summary>
    /// Push notification to client browser.
    /// </summary>
    public async Task PushNotification(string JsonPayload, string endpoint, string p256dh, string auth)
    {
        var subscription = new PushSubscription(endpoint, p256dh, auth);
        await _webPushClient.SendNotificationAsync(subscription, JsonPayload, _options);
    }
}
