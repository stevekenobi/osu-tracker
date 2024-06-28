using Newtonsoft.Json;

namespace osu_tracker.dto
{
    public class OsuAuth
    {
        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
    }
}