using WebService.Controllers;

namespace WebService.Models.Reporting;

public class Report
{
    public List<UserWorkoutTemp> Workouts { get; set; } = new();

    public int Passed { get; set; }

    public int Failed { get; set; }
}
