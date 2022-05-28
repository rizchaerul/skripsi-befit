using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebService.Constants;
using WebService.Models.DataTransferObjects.DrinkReport;
using WebService.Models.DataTransferObjects.HeightReport;
using WebService.Models.DataTransferObjects.UserWorkout;
using WebService.Models.Reporting;
using WebService.Services;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ReportController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;
    private readonly UserIdentityService _userIdentityService;

    public ReportController(BeFitDbContext db, UserIdentityService userIdentityService)
    {
        _beFitDbContext = db;
        _userIdentityService = userIdentityService;
    }

    [HttpGet("workout-report")]
    public async Task<ActionResult<Report>> GetWorkoutReport(DateTime date)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var result = await new UserWorkout().GetWorkoutReport(_beFitDbContext, userAccountId, date);

        return result;
    }

    [HttpGet("drink-report")]
    public async Task<ActionResult<DrinkReportDetail>> GetDrinkReport()
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var result = await new ReportProgress().GetDrinkReport(_beFitDbContext, userAccountId);

        return result;
    }

    [HttpGet("drink-chart")]
    public async Task<ActionResult<List<DrinkReportChartItem>>> GetDrinkChart(DateTime month)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var result = await new ReportProgress().GetDrinkChart(_beFitDbContext, userAccountId, month);

        return result;
    }

    [HttpPost("drink-progress")]
    public async Task<ActionResult> AddDrinkProgress(int glass)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        await new ReportProgress().AddDrinkProgress(_beFitDbContext, userAccountId, glass);

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("drink-target")]
    public async Task<ActionResult> SetDrinkTarget(int perGlass, int totalGlass)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        await new ReportProgress().SetDrinkTarget(_beFitDbContext, userAccountId, perGlass, totalGlass);

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("current")]
    public async Task<ActionResult<CurrentReport>> GetCurrentReport(Database.Enums.ProgressCategory category)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var result = await new ReportProgress().GetCurrentReport(_beFitDbContext, userAccountId, category);

        return result;
    }

    [HttpPost("setting")]
    public async Task<ActionResult> SetReportTarget(Database.Enums.ProgressCategory category, decimal target)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        await new ReportProgress().SetReportTarget(_beFitDbContext, userAccountId, category, target);

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("insert")]
    public async Task<ActionResult> InsertReportData(Database.Enums.ProgressCategory category, decimal progressReq)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        await new ReportProgress().InsertReportData(_beFitDbContext, userAccountId, category, progressReq);

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<decimal>> GetLastHeight()
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var result = await new ReportProgress().GetLastHeight(_beFitDbContext, userAccountId);

        return result;
    }

    [HttpPost]
    public async Task<ActionResult> InsertHeight(int height)
    {
        var currentDateOnly = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(TimeOffsetConstants.TimeOffset));
        var userAccountId = _userIdentityService.GetUserIdentifier();

        var progress = await _beFitDbContext.ReportProgresses
           .AsTracking()
           .Where(wp => wp.ProgressCategoryId == (int)Database.Enums.ProgressCategory.Height &&
                wp.UserAccountId == userAccountId &&
                wp.ProgressDate.Month == currentDateOnly.Month &&
                wp.ProgressDate.Year == currentDateOnly.Year)
           .FirstOrDefaultAsync();

        if (height < 0)
        {
            height = 0;
        }

        if (progress == null)
        {
            _beFitDbContext.Add(new ReportProgress
            {
                ReportProgressId = Guid.NewGuid(),
                ProgressCategoryId = (int)Database.Enums.ProgressCategory.Height,
                UserAccountId = userAccountId,
                Progress = height,
                ProgressDate = currentDateOnly,
            });
        }
        else
        {
            progress.Progress = height;
        }

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("chart")]
    public async Task<ActionResult<List<HeightReportItem>>> GetChartData(DateTime year, Database.Enums.ProgressCategory category = Database.Enums.ProgressCategory.Height)
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();
        var result = await new ReportProgress().GetChartData(_beFitDbContext, userAccountId, year, category);

        return result;
    }
}
