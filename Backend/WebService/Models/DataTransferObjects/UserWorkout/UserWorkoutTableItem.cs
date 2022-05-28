using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebService.Models.DataTransferObjects.UserWorkout;

public class UserWorkoutTableItem
{
    public Guid Id { get; set; }

    public Guid WorkoutId { get; set; }

    public bool IsCustom { get; set; }

    public int Progress { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Target { get; set; }

    public string Unit { get; set; } = string.Empty;
}
