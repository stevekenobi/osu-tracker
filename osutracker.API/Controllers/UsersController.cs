using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using osutracker.API.Data.Repository;

namespace osutracker.API.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IOsuRepository _osuRepo;

    public UsersController(IOsuRepository osuRepo)
    {
        _osuRepo = osuRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetUser()
    {
        var response = await _osuRepo.GetUser();
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateUser()
    {
        var response = await _osuRepo.UpdateUser();

        return Ok(response);
    }
}
