import OsuClient from '../../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client test', () => {
  describe('getCountryLeaderboard', () => {
    test('returns result', async () => {
      const search = await client.getCountryLeaderboard({ country: 'GR' });
      expect(search?.cursor).not.toBeNull();
      expect(search?.ranking.length).toBe(50);
      expect(search?.ranking.find(user => user.user.country.code !== 'GR')).toBeUndefined();
    });
  });
});
