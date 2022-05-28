namespace WebService.Models.DataTransferObjects.UserWorkout;

public class UserWorkoutTable
{
    public bool? IsOffDay { get; set; }

    public List<UserWorkoutTableItem> Items { get; set; } = new();
}
