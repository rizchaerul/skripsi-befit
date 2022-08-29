using Database.Entities;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;
using WebService;
using WebService.Models.Settings;
using WebService.Services;
using WebService.Services.Commons;

// Heroku use PORT environment variable to store the port the we should be using.
var port = Environment.GetEnvironmentVariable("PORT");

if (!string.IsNullOrWhiteSpace(port))
{
    var parsedPort = int.Parse(port);

    // Set ASPNETCORE_URLS using port that heroku give.
    Environment.SetEnvironmentVariable("ASPNETCORE_URLS", $"http://0.0.0.0:{parsedPort}");
}

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

services.Configure<VapidSettings>(configuration.GetSection(VapidSettings.SectionName));
services.Configure<WebApiSettings>(configuration.GetSection(WebApiSettings.WebApi));

// Get settings from appsettings.json
var openIdConnectOptions = configuration
    .GetSection(OpenIdConnectSettings.SectionName)
    .Get<OpenIdConnectSettings>();

// Add services to the container.
services.AddControllers();
services.AddEndpointsApiExplorer();

// Add Swagger.
// Reference: https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/1235
services.AddSwaggerDocument(options =>
{
    var dict = new Dictionary<string, string>();

    options.AddSecurity(OpenIdConnectSettings.SectionName, new OpenApiSecurityScheme
    {
        AuthorizationUrl = $"{openIdConnectOptions.Authority}/connect/authorize",
        TokenUrl = $"{openIdConnectOptions.Authority}/connect/token",

        Flow = OpenApiOAuth2Flow.Application,
        Type = OpenApiSecuritySchemeType.OAuth2,

        Scopes = new Dictionary<string, string>
        {
            { $"api", "Access APIs" },
        },
    });

    options.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor(OpenIdConnectSettings.SectionName));
});

// Forwarded headers for reverse proxy, useful for https redirection on heroku.
// Reference: https://stackoverflow.com/questions/43749236/net-core-x-forwarded-proto-not-working
services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedProto;
});

// Add JWT Bearer token authentication.
services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = openIdConnectOptions.Authority;
        options.Audience = openIdConnectOptions.Audience;
    });

// Add Database Context.
services.AddDbContextPool<BeFitDbContext>(options =>
{
    // Set default tracking behavior to AsNoTracking()
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
    options.UseNpgsql(configuration.GetConnectionString("Database"));
});

services.AddHttpContextAccessor();

builder.Services.AddHangfire(x => x.UseInMemoryStorage());
builder.Services.AddHangfireServer();

services.AddTransient<WebPushService>();
services.AddTransient<UserIdentityService>();

builder.Services.AddHostedService<RegisterJobsService>();

var app = builder.Build();

app.UseForwardedHeaders();

// Only use https redirection when ASPNETCORE_HTTPS_PORT environtment variable available.
if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT")))
{
    app.UseHttpsRedirection();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi3(options =>
    {
        options.OAuth2Client = new OAuth2ClientSettings
        {
            ClientId = openIdConnectOptions.ClientId,
            ClientSecret = openIdConnectOptions.ClientSecret,
        };
    });
}

app.UseAuthorization();
app.MapControllers();
app.MapHangfireDashboard(new DashboardOptions
{
    Authorization = new[]
    {
        new HangfireCustomBasicAuthenticationFilter
        {
            User = builder.Configuration.GetSection("HangfireSettings:UserName").Value,
            Pass = builder.Configuration.GetSection("HangfireSettings:Password").Value
        }
    }
});
app.Run();
