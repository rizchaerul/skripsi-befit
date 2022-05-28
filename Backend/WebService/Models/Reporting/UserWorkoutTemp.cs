using WebService.Models.DataTransferObjects.UserWorkout;

namespace WebService.Models.Reporting;

public class UserWorkoutTemp
{
    public bool IsOffDay { get; set; }

    public DateTime Date { get; set; }

    public List<UserWorkoutTableItem> Workouts { get; set; } = new();
}
