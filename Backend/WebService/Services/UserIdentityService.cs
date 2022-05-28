namespace WebService.Services;

public class UserIdentityService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserIdentityService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetUserIdentifier()
    {
        var from = _httpContextAccessor.HttpContext?.Request.Headers.From.ToString();
        var id = Guid.Empty;

        if (string.IsNullOrEmpty(from) == false)
        {
            id = Guid.Parse(from);
        }

        return id;
    }

    public bool IsApiKeyValid()
    {
        var from = _httpContextAccessor.HttpContext?.Request.Headers.Authorization.ToString();

        if (from == "Bearer befitSecret123")
        {
            return true;
        }

        return false;
    }
}
