using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
using osu_tracker.dto;
using System;
using System.Net.Http.Json;

namespace osu_tracker.Clients
{
    public class OsuClient
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;
        public OsuClient(IConfiguration config)
        {
            _client = new HttpClient();
            _config = config;
        }
        public async Task<OsuAuth> GetAuth()
        {
            var requestContent = JsonContent.Create(new
            {
                client_id = 27949,
                client_secret = "tPp9TKXZCa2AU8e5uQp8vOK2caWqrmqIamQ8544B",
                grant_type = "client_credentials",
                scope = "public"
            });

            var response = await _client.PostAsync(_config.GetSection("authAPI:URL").Value, requestContent);
            var content = await response.Content.ReadAsStringAsync();

            Console.WriteLine(content);

            var auth = JsonConvert.DeserializeObject<OsuAuth>(content);

            return auth;
        }
        // public async Task<OsuUser> GetUser(int id) 
        // {
        //     var 
        // }
    }
}
