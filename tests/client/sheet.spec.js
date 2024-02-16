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
          rank: 'SH',
          mods: 'HD,SD',
          accuracy: 99.82,
          score: 12375044,
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
        },
      ]);
    });
  });

  describe('updateMissingBeatmaps', () => {
    test('updates missing beatmaps', async () => {
      await sheetClient.clearMissingBeatmaps();
      await sheetClient.updateMissingBeatmaps([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('getMissingBeatmaps', () => {
    test('returns missing beatmap ids', async () => {
      const result = await sheetClient.getMissingBeatmaps();
      expect(result).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });
  });

  describe('updateNoScoreBeatmaps', () => {
    test('updates no score beatmaps', async () => {
      await sheetClient.updateNoScoreBeatmaps([
        {
          beatmap_id: 123,
          beatmapset: {
            artist: 'artist',
            title: 'title',
            creator: 'creator',
          },
          beatmap: {
            version: 'version',
            difficulty_rating: '1.23',
            status: 'ranked',
            total_length: '150',
          },
          count: '12',
        },
      ]);

      const result = await sheetClient.getNoScoreBeatmaps();
      expect(result).toEqual([
        { Link: 'https://osu.ppy.sh/b/123', Artist: 'artist', Title: 'title', Creator: 'creator', Version: 'version', Difficulty: '1.23', Status: 'ranked', Length: '150', Playcount: '12' },
      ]);
    });
  });

  describe('update unfinished beatmaps', () => {
    test.each`
      method                         | title
      ${'updateProblematicBeatmaps'} | ${'Problematic'}
      ${'updateNonSDBeatmaps'}       | ${'Non SD'}
      ${'updateDtBeatmaps'}          | ${'DT'}
    `('updates unfinished', async (obj) => {
      await sheetClient[obj.method]([
        {
          id: 123,
          artist: 'artist',
          title: 'title',
          creator: 'creator',
          version: 'version',
          difficulty: 1.23,
          status: 'loved',
          BPM: 150,
          AR: 9.2,
          CS: 4,
          HP: 7,
          OD: 8,
          length: 124,
        },
      ]);

      const result = await sheetClient.getUnfinishedBeatmaps(obj.title);
      expect(result).toStrictEqual([
        {
          Link: 'https://osu.ppy.sh/b/123',
          Artist: 'artist',
          Title: 'title',
          Creator: 'creator',
          Version: 'version',
          Difficulty: '1.23',
          Status: 'loved',
          BPM: '150',
          AR: '9.2',
          CS: '4',
          HP: '7',
          OD: '8',
          Length: '124',
        },
      ]);
    });
  });
});
