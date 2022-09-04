using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WebService.Enums;
using WebService.Models.DataTransferObjects.Post;
using WebService.Models.DataTransferObjects.UserAccount;
using WebService.Models.Settings;

using DbEnums = Database.Enums;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UserAccountController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;
    private readonly IOptions<WebApiSettings> _webApiSettings;


    public UserAccountController(BeFitDbContext dbContext, IOptions<WebApiSettings> webApiSettings)
    {
        _beFitDbContext = dbContext;
        _webApiSettings = webApiSettings;
    }

    [HttpPost("sign-up")]
    public async Task<ActionResult> SignUp([FromBody] SignUpUserAccount form)
    {
        // Check for existing user.
        var isUserAccountExist = await _beFitDbContext.UserAccounts
            .Where(u => u.Email == form.Email)
            .AnyAsync();

        if (isUserAccountExist)
        {
            return BadRequest("User Account with the same email already exist");
        }

        var newAccount = new UserAccount
        {
            UserAccountId = Guid.NewGuid(),
            FullName = form.FullName,
            Email = form.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(form.Password),
            WaterTarget = 8,
            PerGlass = 230,
            DrinkReminderTimes = new List<string> { "23:00", "05:00", "11:00" }.ToArray(),
            WorkoutReminderTimes = new List<string> { "09:00" }.ToArray(),
        };

        _beFitDbContext.Add(newAccount);

        _beFitDbContext.Add(new UserWorkout
        {
            UserWorkoutId = Guid.NewGuid(),
            Days = new List<int>
                {
                    0, 1, 2, 3, 4, 5, 6
                }
                .ToArray(),
            IsActive = true,
            UserAccountId = newAccount.UserAccountId
        });

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserAccountDetails>> Login([FromBody] LoginUserAccount form)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .Where(u => u.Email == form.Email)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        var isPasswordCorrect = BCrypt.Net.BCrypt.Verify(form.Password, userAccount.Password);

        if (isPasswordCorrect)
        {
            return new UserAccountDetails
            {
                UserAccountId = userAccount.UserAccountId,
                FullName = userAccount.FullName,
                Email = userAccount.Email,
                PictureBase64 = $"{_webApiSettings.Value.Url}/api/image/profile/{userAccount.UserAccountId}",
                IsAdmin = userAccount.IsAdmin
            };
        }

        return Unauthorized();
    }

    [HttpGet("{userAccountId}")]
    public async Task<ActionResult<UserAccountDetails>> GetUserAccountById([FromRoute] Guid userAccountId)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .Where(u => u.UserAccountId == userAccountId)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        return new UserAccountDetails
        {
            UserAccountId = userAccount.UserAccountId,
            FullName = userAccount.FullName,
            Email = userAccount.Email,
            PictureBase64 = $"{_webApiSettings.Value.Url}/api/image/profile/{userAccount.UserAccountId}"
        };
    }

    [HttpPut("{userAccountId}")]
    public async Task<ActionResult<UserAccountDetails>> UpdateUserAccount([FromRoute] Guid userAccountId, [FromBody] UserAccountUpdate form)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .AsTracking()
            .Where(u => u.UserAccountId == userAccountId)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        userAccount.Email = form.Email;
        userAccount.FullName = form.FullName;

        if (!string.IsNullOrEmpty(form.PictureBase64))
        {
            userAccount.PictureBase64 = form.PictureBase64;
        }

        await _beFitDbContext.SaveChangesAsync();

        return new UserAccountDetails
        {
            UserAccountId = userAccount.UserAccountId,
            FullName = userAccount.FullName,
            Email = userAccount.Email,
            PictureBase64 = $"{_webApiSettings.Value.Url}/api/image/profile/{userAccount.UserAccountId}",
        };
    }

    [HttpPut("{userAccountId}/change-password")]
    public async Task<ActionResult> UpdatePassword([FromRoute] Guid userAccountId, [FromBody] PasswordUpdate form)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .AsTracking()
            .Where(u => u.UserAccountId == userAccountId)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        var isPasswordCorrect = BCrypt.Net.BCrypt.Verify(form.OldPassword, userAccount.Password);

        if (isPasswordCorrect == false)
        {
            return BadRequest("Wrong password");
        }

        userAccount.Password = BCrypt.Net.BCrypt.HashPassword(form.NewPassword);

        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("{userAccountId}/notification")]
    public async Task<ActionResult<NotificationSettingDetails>> GetNotificationSettings([FromRoute] Guid userAccountId)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .Where(u => u.UserAccountId == userAccountId)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        return new NotificationSettingDetails
        {
            IsCommentNotificationActive = userAccount.IsCommentNotificationActive.GetValueOrDefault(),
            IsDrinkNotificationActive = userAccount.IsDrinkNotificationActive.GetValueOrDefault(),
            IsReminderNotificationActive = userAccount.IsReminderNotificationActive.GetValueOrDefault(),
            DrinkNotificationTimes = userAccount.DrinkReminderTimes?.ToList() ?? new(),
            WorkoutNotificationTimes = userAccount.WorkoutReminderTimes?.ToList() ?? new(),
        };
    }

    [HttpPut("{userAccountId}/notification")]
    public async Task<ActionResult<NotificationSettingDetails>> UpdateNotificationSettings([FromRoute] Guid userAccountId,
        [FromBody] NotificationSettingDetails form)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .AsTracking()
            .Where(u => u.UserAccountId == userAccountId)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        userAccount.IsCommentNotificationActive = form.IsCommentNotificationActive;
        userAccount.IsDrinkNotificationActive = form.IsDrinkNotificationActive;
        userAccount.IsReminderNotificationActive = form.IsReminderNotificationActive;

        userAccount.WorkoutReminderTimes = form.WorkoutNotificationTimes.ToArray();
        userAccount.DrinkReminderTimes = form.DrinkNotificationTimes.ToArray();

        await _beFitDbContext.SaveChangesAsync();

        return new NotificationSettingDetails
        {
            IsCommentNotificationActive = userAccount.IsCommentNotificationActive.Value,
            IsDrinkNotificationActive = userAccount.IsDrinkNotificationActive.Value,
            IsReminderNotificationActive = userAccount.IsReminderNotificationActive.Value,

            DrinkNotificationTimes = userAccount.DrinkReminderTimes.ToList(),
            WorkoutNotificationTimes = userAccount.WorkoutReminderTimes.ToList(),
        };
    }

    [HttpGet("favorite")]
    public async Task<ActionResult<PostList>> GetFavoritePosts(Guid? userAccountId, int page = 1, int pageSize = 10)
    {
        var result = await new UserAccount().GetFavoritePosts(_beFitDbContext, _webApiSettings.Value.Url, userAccountId, page, pageSize);
        return result;
    }

    [HttpGet("own-post")]
    public async Task<ActionResult<PostList>> GetOwnPosts(DbEnums.PostCategory? category, PostSortType? sortType, Guid? userAccountId, int page = 1, int pageSize = 10)
    {
        var result = await new UserAccount().GetOwnPosts(_beFitDbContext, _webApiSettings.Value.Url, category, sortType, userAccountId, page, pageSize);
        return result;
    }
}
