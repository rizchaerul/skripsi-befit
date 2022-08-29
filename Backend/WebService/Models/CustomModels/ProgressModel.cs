using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebService.Models.CustomModels
{
    public class ProgressModel
    {
        public Guid WorkoutId { get; set; }
        public int Progress { get; set; }
    }
}
