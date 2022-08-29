using System.ComponentModel.DataAnnotations;
using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WebService.Constants;
using WebService.Models.DataTransferObjects.Post;
using WebService.Models.DataTransferObjects.UserWorkout;
using WebService.Models.DataTransferObjects.Workout;
using WebService.Models.Settings;
using WebService.Services;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UserWorkoutController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;
    private readonly IOptions<WebApiSettings> _webApiSettings;
    private readonly UserIdentityService _userIdentityService;

    public UserWorkoutController(BeFitDbContext db, IOptions<WebApiSettings> webApiSettings, UserIdentityService userIdentityService)
    {
        _beFitDbContext = db;
        _webApiSettings = webApiSettings;
        _userIdentityService = userIdentityService;
    }

    [HttpGet("days")]
    public async Task<ActionResult<List<int>>> GetDays([FromHeader] Guid identifier)
    {
        var result = await new UserWorkout().GetUserDays(_beFitDbContext, identifier);

        return result;
    }

    [HttpPost("days")]
    public async Task<ActionResult> SubmitDays([FromHeader] Guid identifier, [FromBody] int day)
    {
        await new UserWorkout().SubmitDays(_beFitDbContext, identifier, day);
        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> UpdateTarget(Guid workoutDetailId, int newTarget)
    {
        var workoutDetail = await _beFitDbContext.UserWorkoutDetails
            .AsTracking()
            .Where(wd => wd.UserWorkoutDetailId == workoutDetailId)
            .FirstOrDefaultAsync();

        if (workoutDetail != null)
        {
            workoutDetail.Target = newTarget;

            await _beFitDbContext.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<List<Models.DataTransferObjects.Workout.WorkoutItem>>> GetWorkouts(Guid userAccountId, Guid? workoutCategoryId)
    {
        var userWorkoutIds = await _beFitDbContext.UserWorkoutDetails
            .Where(uwd => uwd.UserWorkout.UserAccountId == userAccountId && uwd.UserWorkout.IsActive)
            .Select(uwd => uwd.WorkoutId)
            .ToListAsync();

        var workouts = await _beFitDbContext.Workouts
            .Where(w => workoutCategoryId == null || w.WorkoutCategoryId == workoutCategoryId)
            .Where(w => !userWorkoutIds.Contains(w.WorkoutId))
            .Where(w => w.WorkoutCategory.Name != "Custom")
            .Select(w => new Models.DataTransferObjects.Workout.WorkoutItem
            {
                Id = w.WorkoutId,
                Name = w.Name,
                IconBase64 = $"{_webApiSettings.Value.Url}/api/image/workout/{w.WorkoutId}",
                Times = $"{UnitConvertService.ConvertUnitName(w.Unit)}",
                Description = w.Description ?? "",
                Url = w.VideoUrl ?? "",
            })
            .ToListAsync();

        return workouts;
    }

    [HttpPost("manual")]
    public async Task<ActionResult> AddManualWorkout([FromBody] UserWorkoutManualForm form)
    {
        await new UserWorkout().AddManualWorkout(_beFitDbContext, form);
        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult> AddWorkout(Guid userAccountId, Guid workoutId, [Range(1, int.MaxValue)] int times = 1)
    {
        await new UserWorkout().AddWorkout(_beFitDbContext, userAccountId, workoutId, times);
        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("progress")]
    public async Task<ActionResult> InsertProgress(Guid workoutId, int progress)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var dateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

        var workoutProgress = await _beFitDbContext.WorkoutProgresses
            .AsTracking()
            .Where(wp => wp.WorkoutId == workoutId && wp.UserAccountId == userAccountId && wp.WorkoutDate == dateOnly)
            .FirstOrDefaultAsync();

        if (workoutProgress == null)
        {
            _beFitDbContext.Add(new WorkoutProgress
            {
                WorkoutProgressId = Guid.NewGuid(),
                Progress = progress,
                UserAccountId = userAccountId,
                WorkoutDate = dateOnly,
                WorkoutId = workoutId,
            });
        }
        else
        {
            workoutProgress.Progress = progress;
        }

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("workout-desc")]
    public async Task<ActionResult<WorkoutDescription>> GetWorkoutDesc(Guid workoutId)
    {
        var desc = await _beFitDbContext.Workouts
            .Where(w => w.WorkoutId == workoutId)
            .FirstOrDefaultAsync();

        return new WorkoutDescription
        {
            Desc = desc?.Description ?? "",
            Name = desc.Name,
            Src = $"{_webApiSettings.Value.Url}/api/image/workout/{workoutId}",
            Url = desc?.VideoUrl ?? "",
        };
    }

    [HttpGet("{userAccountId}")]
    public async Task<ActionResult<UserWorkoutTable>> GetUserWorkouts(Guid userAccountId)
    {
        var dateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));

        var userWorkout = await _beFitDbContext.UserWorkouts
            .Where(uw => uw.UserAccountId == userAccountId && uw.IsActive)
            .Select(uw => new
            {
                IsOffDay = uw.Days.Contains((int)dateOnly.DayOfWeek) == false,
                Workouts = uw.UserWorkoutDetails
                    .Where(wd => wd.UserWorkout.Days.Contains((int)dateOnly.DayOfWeek))
                    .Select(wd => new UserWorkoutTableItem
                    {
                        Id = wd.UserWorkoutDetailId,
                        Name = wd.Workout.Name,
                        Target = wd.Target,
                        Unit = UnitConvertService.ConvertUnitName(wd.Workout.Unit),
                        WorkoutId = wd.WorkoutId,
                        IsCustom = wd.Workout.WorkoutCategory.Name == "Custom",

                        Progress = wd.Workout.WorkoutProgresses
                            .Where(wp => wp.UserAccountId == userAccountId && wp.WorkoutDate == dateOnly)
                            .Sum(wp => wp.Progress)
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();

        if (userWorkout == null)
        {
            return new UserWorkoutTable();
        }

        var userWorkoutTable = new UserWorkoutTable();
        userWorkoutTable.Items.AddRange(userWorkout.Workouts);
        userWorkoutTable.IsOffDay = userWorkout.IsOffDay;

        return userWorkoutTable;
    }

    [HttpDelete("{workoutDetailId}")]
    public async Task<ActionResult> DeleteWorkoutDetail(Guid workoutDetailId)
    {
        var workoutDetail = await _beFitDbContext.UserWorkoutDetails
            .Where(uwd => uwd.UserWorkoutDetailId == workoutDetailId)
            .FirstOrDefaultAsync();

        if (workoutDetail != null)
        {
            _beFitDbContext.Remove(workoutDetail);
            await _beFitDbContext.SaveChangesAsync();
            return Ok();

        }
        else
        {
            return BadRequest();
        }
    }
}
