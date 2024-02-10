const { OsuClient } = require('../../src/client/OsuClient');

const client = new OsuClient({
  clientId: process.env.client_id,
  clientSecret: process.env.client_secret,
});

describe('osu client', () => {
  describe('getCountryLeaderboard', () => {
    test('returns the first 100 users of a country', async () => {
      const response = await client.getCountryLeaderboard({ limit: 100 });
      expect(response.ranking.length.toBe(100));
    });
  });
});
