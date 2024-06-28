using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using osu_tracker.Clients;

namespace osu_tracker.Controllers
{
    [ApiController]
    [Route("api/leaderboard")]
    public class LeaderboardController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> GetLeaderboard()
        {
            var client = new OsuClient();
            var result = await client.GetAuth();
            return Ok(result);
        }
    }
}