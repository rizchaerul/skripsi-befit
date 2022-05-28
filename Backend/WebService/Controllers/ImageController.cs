using Database.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WebService.Models.Settings;

namespace WebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private const string BLANK_PROFILE = "data:image/png;base64,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";
        private readonly BeFitDbContext _beFitDbContext;
        private readonly IOptions<WebApiSettings> _webApiSettings;

        public ImageController(IOptions<WebApiSettings> webApiSettings, BeFitDbContext db)
        {
            _beFitDbContext = db;
            _webApiSettings = webApiSettings;
        }

        private static (MemoryStream, string) ImageStringToStream(string input)
        {
            // var base64 = input.Substring(input.IndexOf(',') + 1);
            var base64 = input[(input.IndexOf(',') + 1)..];

            int pFrom = input.IndexOf(":") + 1;
            int pTo = input.LastIndexOf(";");

            // var fileType = input.Substring(pFrom, pTo - pFrom);
            var fileType = input[pFrom..pTo];

            byte[] bytes = Convert.FromBase64String(base64);
            var stream = new MemoryStream(bytes);

            return (stream, fileType);
        }

        [HttpGet("profile/{userAccountId}")]
        public async Task<ActionResult> GetProfilePicture(Guid userAccountId)
        {
            var picture = await _beFitDbContext.UserAccounts
                .Where(ua => ua.UserAccountId == userAccountId)
                .FirstOrDefaultAsync();

            var (stream, fileType) = ImageStringToStream(picture?.PictureBase64 ?? BLANK_PROFILE);

            Console.WriteLine(_webApiSettings.Value.Url);

            return File(stream, fileType);
        }

        [HttpGet("workout/{workoutId}")]
        public async Task<ActionResult> GetWorkoutIcon(Guid workoutId)
        {
            var picture = await _beFitDbContext.Workouts
                .Where(w => w.WorkoutId == workoutId)
                .FirstOrDefaultAsync();

            if (picture == null)
            {
                return NotFound();
            }

            var (stream, fileType) = ImageStringToStream(picture?.IconBase64 ?? "");

            Console.WriteLine(_webApiSettings.Value.Url);

            return File(stream, fileType);
        }
    }
}
