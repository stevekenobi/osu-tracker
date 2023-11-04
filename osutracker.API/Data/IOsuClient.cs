using System.Threading.Tasks;
using osutracker.Models.OsuModels;

namespace osutracker.API.Data.Clients;
public interface IOsuClient
{
    Task<OsuUser> GetUser(int userId);
}