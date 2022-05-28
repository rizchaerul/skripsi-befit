using System.Net;
using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebService.Models.DataTransferObjects.UserAccount;
using WebService.Services;

namespace WebService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UserController : ControllerBase
{
    private readonly BeFitDbContext _beFitDbContext;
    private readonly UserIdentityService _userIdentityService;


    public UserController(BeFitDbContext dbContext, UserIdentityService userIdentityService)
    {
        _beFitDbContext = dbContext;
        _userIdentityService = userIdentityService;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserAccountItem>>> Get()
    {
        return await _beFitDbContext.UserAccounts
            .Select(ua => new UserAccountItem
            {
                Id = ua.UserAccountId,
                Name = ua.FullName,
                PictureBase64 = ua.PictureBase64,
            })
            .ToListAsync();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userAccount = await _beFitDbContext.UserAccounts
            .Where(ua => ua.UserAccountId == id)
            .FirstOrDefaultAsync();

        if (userAccount == null)
        {
            return NotFound();
        }

        _beFitDbContext.Remove(userAccount);
        await _beFitDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("check")]
    public async Task<ActionResult<bool>> Check()
    {
        var userAccountId = _userIdentityService.GetUserIdentifier();

        var doesUserExist = await _beFitDbContext.UserAccounts
            .Where(ua => ua.UserAccountId == userAccountId)
            .AnyAsync();

        return doesUserExist;
    }
}
