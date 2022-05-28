using System.ComponentModel.DataAnnotations;

namespace WebService.Models.DataTransferObjects.WorkoutCategory;

public class WorkoutCategoryForm
{
    [Required]
    public string Name { get; set; } = string.Empty;
}
