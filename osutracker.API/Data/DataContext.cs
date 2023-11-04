using Microsoft.EntityFrameworkCore;
using osutracker.API.Models.AppModels;

namespace osutracker.API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Score> Scores { get; set; }
}