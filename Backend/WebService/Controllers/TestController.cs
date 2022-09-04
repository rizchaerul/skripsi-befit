using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly BeFitDbContext _db;

        public TestController(BeFitDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var users = await _db.UserAccounts
                .AsTracking()
                .ToListAsync();

            foreach (var user in users)
            {
                var hours = new List<string> { "12:00", "9:00", "15:00", "6:00", "18:00", "21:00", "8:00", "14:00", "20:00", "7:00", "13:00", "19:00", "10:00", "16:00", "11:00", "17:00" };
                var total = user.WaterTarget;

                if (total <= 0)
                {
                    user.DrinkReminderTimes = null;
                }
                else
                {
                    if (total > 16)
                    {
                        total = 16;
                    }

                    user.DrinkReminderTimes = hours.Take(total).ToArray();

                }
            }

            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
