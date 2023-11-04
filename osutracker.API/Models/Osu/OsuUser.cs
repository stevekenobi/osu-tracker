using Newtonsoft.Json;

namespace osutracker.Models.OsuModels;
public class OsuUser
{
    [JsonProperty("avatar_url")]
    public string AvatarUrl { get; set; }
    [JsonProperty("country_code")]
    public string CountryCode {get; set;}

    [JsonProperty("default_group")]
    public string DefaultGroup { get; set; }
    public int Id { get; set; }
    public string Username {get; set;}
    [JsonProperty("beatmap_playcounts_count")]
    public int BeatmapsPlayed {get; set;}
    public OsuStatistics Statistics {get; set;}
}