const SheetClient = require('../../src/client/SheetClient');

const sheetClient = new SheetClient(
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
);

describe('sheet client', () => {
  describe('updateLeaderboard', () => {
    test('updates the leaderboard', async () => {
      await sheetClient.updateLeaderboard([{
        pp: 125,
        ranked_score: 125,
        hit_accuracy: 65.32,
        play_count: 485,
        total_score: 8452,
        grade_counts: {
          ss: 25,
          ssh: 25,
          s: 25,
          sh: 25,
          a: 25,
        },
        user: {
          id: 12375044,
          username: 'Steve Kenobi'
        },
      }]);
    });
  });
});
