using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database.Entities;

namespace WebService.Models.Job
{
    public class CheckDrinkModel
    {
        public Guid UserAccountId { get; set; }
        public string Email { get; set; } = string.Empty;
        public int DrinkTarget { get; set; }
        public ReportProgress? DrinkProgress { get; set; }
    }
}
