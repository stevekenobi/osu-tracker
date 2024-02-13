const SheetClient = require('../../src/client/SheetClient');

const sheetClient = new SheetClient('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc');

describe('sheet client', () => {
  describe('updateLeaderboard', () => {
    test('updates the leaderboard', async () => {
      await sheetClient.updateLeaderboard([
        {
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
            username: 'Steve Kenobi',
          },
        },
      ]);
    });
  });

  describe('updateBeatmapsOfYear', () => {
    test('updates the beatmaps of a year', async () => {
      await sheetClient.updateBeatmapsOfYear('2007', [
        {
          id: 1235,
          artist: 'artist',
          title: 'title',
          creator: 'creator',
          version: 'version',
          difficulty: 3.65,
          status: 'ranked',
          BPM: 145,
          AR: 7.5,
          CS: 3.6,
          HP: 5,
          OD: 6,
          length: 154,
          Score: {
            rank: 'SH',
            mods: 'HD,SD',
            accuracy: 99.82,
            score: 12375044,
          },
        },
        {
          id: 1235,
          artist: 'artist',
          title: 'title',
          creator: 'creator',
          version: 'version',
          difficulty: 4.62,
          status: 'ranked',
          BPM: 145,
          AR: 7.5,
          CS: 3.6,
          HP: 5,
          OD: 6,
          length: 154,
          Score: null,
        },
      ]);
    });
  });

  describe('updateMissingBeatmaps', () => {
    test('updates missing beatmaps', async () => {
      await sheetClient.updateMissingBeatmaps([1,2,3,4,5,6,7]);
    });
  });

  describe('getMissingBeatmaps', () => {
    test('returns missing beatmap ids', async () => {
      const result = await sheetClient.getMissingBeatmaps();
      expect(result).toEqual([1,2,3,4,5,6,7]);
    });
  });
});
