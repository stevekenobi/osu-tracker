import OsuClient from '../../../src/client/OsuClient';

const client = new OsuClient({
  client_id: process.env['CLIENT_ID'] ?? '',
  client_secret: process.env['CLIENT_SECRET'] ?? '',
});

describe('osu client test', () => {
  describe('getScoreLeaderboard', () => {
    test('returns leaderboard', async () => {
      const leaderboard = await client.getScoreLeaderboard();
      expect(leaderboard?.ranking.length).toBe(50);
      expect(leaderboard?.ranking.find(user => user.ranked_score < 100000000000)).toBeUndefined();
    });
  });
});
