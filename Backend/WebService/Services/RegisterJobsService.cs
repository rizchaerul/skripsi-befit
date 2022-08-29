using System;
using System.Threading;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.Extensions.Hosting;

namespace WebService.Services
{
    public class RegisterJobsService : BackgroundService
    {
        protected override Task ExecuteAsync(CancellationToken ct)
        {
            RecurringJob.AddOrUpdate("JobName",
                () => HelloWorld(),
                "*/5 * * * *");

            return Task.CompletedTask;
        }

        public string HelloWorld()
        {
            return "Hello, World!";
        }
    }
}
