using System.Formats.Asn1;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using osutracker.API.Data.Clients;
using osutracker.API.Models.AppModels;
using osutracker.Models.OsuModels;

namespace osutracker.API.Data.Repository;
public class OsuRepository : IOsuRepository
{
    private readonly DataContext _context;
    private readonly IOsuClient _osuClient;
    private readonly IMapper _mapper;

    public OsuRepository(DataContext context, IOsuClient osuClient, IMapper mapper)
    {
        _context = context;
        _osuClient = osuClient;
        _mapper = mapper;
    }

    public async Task<User> GetUser()
    {
        var users = await _context.Users.ToListAsync();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == 12375044);
        return user;
    }

    public async Task<object> UpdateUser()
    {
        var userFromSource = await _osuClient.GetUser(12375044);
        var userFromDB = await GetUser();
        var userToAdd = _mapper.Map<User>(userFromSource);
        if (userFromDB == null)
        {
            _context.Users.Add(userToAdd);
        }
        else
        {
            userFromDB.RankedScore = userToAdd.RankedScore;
            userFromDB.TotalScore = userToAdd.TotalScore;
            userFromDB.PlayCount = userToAdd.PlayCount;
            userFromDB.A = userToAdd.A;
            userFromDB.S = userToAdd.S;
            userFromDB.SH = userToAdd.SH;
            userFromDB.SS = userToAdd.SS;
            userFromDB.SSH = userToAdd.SSH;
        }
        await _context.SaveChangesAsync();
        return "ok";
    }
}