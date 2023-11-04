using System.Threading.Tasks;
using osutracker.API.Models.AppModels;
using osutracker.Models.OsuModels;

namespace osutracker.API.Data.Repository;
public interface IOsuRepository
{
    Task<User> GetUser();
    Task<object> UpdateUser();
}