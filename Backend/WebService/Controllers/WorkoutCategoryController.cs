using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebService.Models.DataTransferObjects.Dropdown;
using WebService.Models.DataTransferObjects.WorkoutCategory;

namespace WebService.Controllers;

[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
public class WorkoutCategoryController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;

    public WorkoutCategoryController(BeFitDbContext dbContext)
    {
        _beFitDbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<WorkoutCategoryItem>>> Get()
    {
        return await _beFitDbContext.WorkoutCategories
            .Where(wc => wc.IsHidden == false)
            .Select(wc => new WorkoutCategoryItem
            {
                Id = wc.WorkoutCategoryId,
                Name = wc.Name,
            })
            .OrderBy(wc => wc.Name)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutCategoryDetail>> GetById([FromRoute] Guid id)
    {
        var result = await _beFitDbContext.WorkoutCategories
            .Where(workoutCategory => workoutCategory.WorkoutCategoryId == id)
            .Select(workoutCategory => new WorkoutCategoryDetail
            {
                Name = workoutCategory.Name,
            })
            .FirstOrDefaultAsync();

        if (result == null)
        {
            return NotFound();
        }

        return result;
    }

    [HttpPost]
    public async Task<ActionResult> Insert([FromBody] WorkoutCategoryForm form)
    {
        var existingWorkoutCategory = await _beFitDbContext.WorkoutCategories
            .Where(workoutCategories => workoutCategories.Name == form.Name)
            .FirstOrDefaultAsync();

        if (existingWorkoutCategory != null)
        {
            return BadRequest("Workout Category already exist");
        }

        _beFitDbContext.Add(new WorkoutCategory
        {
            WorkoutCategoryId = Guid.NewGuid(),
            Name = form.Name
        });

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update([FromRoute] Guid id, [FromBody] WorkoutCategoryForm form)
    {
        var existingWorkoutCategory = await _beFitDbContext.WorkoutCategories
            .AsTracking()
            .Where(workoutCategories => workoutCategories.WorkoutCategoryId == id)
            .FirstOrDefaultAsync();


        if (existingWorkoutCategory == null)
        {
            return NotFound();
        }

        var notUnique = await _beFitDbContext.WorkoutCategories
            .Where(workoutCategories => workoutCategories.Name == form.Name &&
                workoutCategories.WorkoutCategoryId != id)
            .AnyAsync();

        if (notUnique)
        {
            return BadRequest("Workout Category already exist");
        }

        existingWorkoutCategory.Name = form.Name;

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] Guid id)
    {
        var existingWorkoutCategory = await _beFitDbContext.WorkoutCategories
            .Where(workoutCategories => workoutCategories.WorkoutCategoryId == id)
            .FirstOrDefaultAsync();

        if (existingWorkoutCategory == null)
        {
            return NotFound();
        }

        _beFitDbContext.Remove(existingWorkoutCategory);

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }
}
