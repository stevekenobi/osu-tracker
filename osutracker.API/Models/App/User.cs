namespace osutracker.API.Models.AppModels;
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public ulong RankedScore { get; set; }

    public ulong TotalScore { get; set; }

    public int PlayCount { get; set; }

    public int SS { get; set; }

    public int S { get; set; }

    public int SH { get; set; }

    public int SSH { get; set; }

    public int A { get; set; }
}