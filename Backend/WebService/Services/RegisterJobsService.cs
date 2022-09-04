using System;
using System.Threading;
using System.Threading.Tasks;
using Database.Entities;
using Hangfire;
using Microsoft.Extensions.Hosting;
using WebService.Controllers;
using WebService.Services.Commons;

namespace WebService.Services
{
    public class RegisterJobsService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public RegisterJobsService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override Task ExecuteAsync(CancellationToken ct)
        {
            var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<BeFitDbContext>();
            var jobService = scope.ServiceProvider.GetRequiredService<JobController>();

            RecurringJob.AddOrUpdate("ReminderNotification",
                () => jobService.NotifyUser(),
                "*/5 * * * *");

            return Task.CompletedTask;
        }

        public string HelloWorld()
        {
            return "Hello, World!";
        }
    }
}
