using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebService.Models.DataTransferObjects.Workout;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class WorkoutController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;

    public WorkoutController(BeFitDbContext dbContext)
    {
        _beFitDbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<WorkoutItem>>> Get(Guid categoryId)
    {
        return await _beFitDbContext.Workouts
            .Where(w => w.WorkoutCategoryId == categoryId)
            .Select(w => new WorkoutItem
            {
                Id = w.WorkoutId,
                Name = w.Name,
                IconBase64 = w.IconBase64 ?? "",
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutDetails>> GetById(Guid id)
    {
        var workout = await _beFitDbContext.Workouts
            .Where(w => w.WorkoutId == id)
            .Select(w => new WorkoutDetails
            {
                Description = w.Description ?? "",
                Name = w.Name,
                // IsMinute = w.IsMinute,
                Unit = w.Unit,
                VideoUrl = w.VideoUrl ?? "",
                IconBase64 = w.IconBase64 ?? "",
                CategoryId = w.WorkoutCategoryId,
            })
            .FirstOrDefaultAsync();

        if (workout == null)
        {
            return NotFound();
        }

        return workout;
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] WorkoutForm form)
    {
        var doesWorkoutExist = await _beFitDbContext.Workouts
            .Where(w => w.Name == form.Name)
            .AnyAsync();

        if (doesWorkoutExist)
        {
            return BadRequest("Workout with the same name already exist");
        }

        _beFitDbContext.Add(new Workout
        {
            WorkoutId = Guid.NewGuid(),
            Description = form.Description,
            IconBase64 = form.IconBase64,
            // IsMinute = form.IsMinute,
            Unit = form.Unit,
            Name = form.Name,
            VideoUrl = form.VideoUrl,
            WorkoutCategoryId = form.CategoryId,
        });

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkoutDetails>> Update(Guid id, [FromBody] WorkoutForm form)
    {
        var workout = await _beFitDbContext.Workouts
            .AsTracking()
            .Where(w => w.WorkoutId == id)
            .FirstOrDefaultAsync();

        if (workout == null)
        {
            return NotFound();
        }

        var isDuplicate = await _beFitDbContext.Workouts
            .Where(w => w.WorkoutId != id && w.Name == form.Name)
            .AnyAsync();

        if (isDuplicate)
        {
            return BadRequest("Workout with the same name already exist");
        }

        workout.Description = form.Description;
        // workout.IsMinute = form.IsMinute;
        workout.Unit = form.Unit;
        workout.Name = form.Name;
        workout.VideoUrl = form.VideoUrl;

        if (string.IsNullOrEmpty(form.IconBase64) == false)
        {
            workout.IconBase64 = form.IconBase64;
        }

        await _beFitDbContext.SaveChangesAsync();

        return new WorkoutDetails
        {
            CategoryId = workout.WorkoutCategoryId,
            Description = workout.Description,
            IconBase64 = workout.IconBase64 ?? "",
            // IsMinute = workout.IsMinute,
            Unit = workout.Unit,
            Name = workout.Name,
            VideoUrl = workout.VideoUrl,
        };
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var doesWorkoutExist = await _beFitDbContext.Workouts
            .Where(w => w.WorkoutId == id)
            .FirstOrDefaultAsync();

        if (doesWorkoutExist == null)
        {
            return NotFound();
        }

        _beFitDbContext.Remove(doesWorkoutExist);
        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }
}
