const OsuClient = require('../../src/client/OsuClient');

const client = new OsuClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

describe('osu client', () => {
  describe('getCountryLeaderboard', () => {
    test('returns the first 50 users of a country', async () => {
      const response = await client.getCountryLeaderboard({ country: 'GR' });
      expect(response.ranking.length).toBe(50);
    });

    test('returns users of the same country', async () => {
      const response = await client.getCountryLeaderboard({ country: 'GR' });
      expect(response.ranking.every((u) => u.user.country.code === 'GR'));
    });
  });
});
