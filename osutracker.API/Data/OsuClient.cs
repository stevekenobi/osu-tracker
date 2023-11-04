using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using osutracker.Models.OsuModels;

namespace osutracker.API.Data.Clients;
public class OsuClient : IOsuClient
{
    private readonly HttpClient _client;

    public OsuClient()
    {
        _client = new HttpClient
        {
            BaseAddress = new Uri("https://osu.ppy.sh/api/v2/")
        };
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyNzk0OSIsImp0aSI6IjRlNDRhZWZkMTU1NTE1MWI1MzlkYWY2N2Q4MzdiZTk0ZjBlZmVmMmYzNGQ4MTdiYThjMTJkMDcwM2M4ZTM0NDc1YmE5OGU4ZWNhZTY0MTc0IiwiaWF0IjoxNjk5MDgyNjA2LjQ1OTU0LCJuYmYiOjE2OTkwODI2MDYuNDU5NTQxLCJleHAiOjE2OTkxNjkwMDYuNDU1MzM4LCJzdWIiOiIiLCJzY29wZXMiOlsicHVibGljIl19.m6GYkfnNlLguTLHDusaCnZRS7c__Txw-kFyKa5llE5CHNkJPZqGSv2Kr7ubnJemtYj-kU9ygZiVD4A5fXCryXNchVhQmnH0wOIpvIKzTDa96YI8vc_2sgoCkzbMkgtIvGOQf488eAeEB5VjBekHIXKhqiBu7Ag2LO_MJmPxdRZS1xrPlPnuI9szNwKiwu3u1UVq10jo9AzxfverYc_UNZ_q-cRSdWBeXoUCk_DEb7nGJwgAOlW5hVBUWsyzC14wkxYSdYKg56ef2WHl2-qFJg41ChujPwWE2iAnjr_j7MazvnkZRPLXOCb2yYhEZxcqeCR4aaOtYCdr_82xAV2rYKYMoj0SmjaOLS9w7R2DfpRRupbGllQLLgzMx11hIdymuKcrwyGK7_1Zx_ol4A13G7OUy7KtaXL75ehdQHvxl60es6p7e4ch3qETkYfWexfiQClQdX40x25ASLeqf1GW354cHYXDU7FN6RRRauRsGE4gfsyEhUF6YmIm18A-fRqMB8xa5Tg642F9C2IUYxXgcW7dKNPWbCG25C0qq_SlJ0npXK4T12eYSov-cHsbPoslIb7_ZNsuhaDqtNAC0MtwmXluhpBK4QMRm7VcI1U8ebjg0VbSebouwnXRcchVsMe3Yv-zjcqijGBp8-vRpT1DPMSGS9CaFqZ9x2lJJIn5Owis");
    }

    public async Task<OsuUser> GetUser(int userId)
    {
        var response = await _client.GetAsync($"users/{userId}");
        var content = await response.Content.ReadAsStringAsync();
        var user = JsonConvert.DeserializeObject<OsuUser>(content);
        return user;
    }
}