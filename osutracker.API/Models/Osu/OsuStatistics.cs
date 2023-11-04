using Newtonsoft.Json;
using osutracker.API.Helpers;

namespace osutracker.Models.OsuModels;
[JsonConverter(typeof(JsonPathConverter))]
public class OsuStatistics
{
    [JsonProperty("ranked_score")]
    public ulong RankedScore { get; set; }

    [JsonProperty("total_score")]
    public ulong TotalScore { get; set; }

    [JsonProperty("play_count")]
    public int PlayCount { get; set; }

    [JsonProperty("grade_counts.ss")]
    public int SS { get; set; }

    [JsonProperty("grade_counts.s")]
    public int S { get; set; }

    [JsonProperty("grade_counts.sh")]
    public int SH { get; set; }

    [JsonProperty("grade_counts.ssh")]
    public int SSH { get; set; }

    [JsonProperty("grade_counts.a")]
    public int A { get; set; }
}

