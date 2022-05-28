namespace WebService.Models.Settings;

public class OpenIdConnectSettings
{
    public const string SectionName = "OpenIdConnect";

    public string Audience { get; set; } = string.Empty;

    public string Authority { get; set; } = string.Empty;

    public string ClientId { get; set; } = string.Empty;

    public string ClientSecret { get; set; } = string.Empty;
}
