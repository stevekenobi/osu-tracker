import SheetClient from '../../src/client/SheetClient';

const sheetClient = new SheetClient('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc');

describe.concurrent('sheet client', () => {
  describe.sequential('leaderboard', () => {
    test('updateLeaderboard', async () => {
      await sheetClient.updateLeaderboard([
        {
          '#': '1',
          Username: 'Steve Kenobi',
          Link: 'https://osu.ppy.sh/u/1234',
          'Ranked Score': '125',
          Accuracy: '65.32',
          Playcount: '485',
          'Total Score': '8452',
          SSH: '25',
          SS: '25',
          SH: '25',
          S: '25',
          A: '25',
        },
      ]);
    });

    test('getLeaderboard', async () => {
      const result = await sheetClient.getLeaderboard();
      expect(result).toStrictEqual([
        {
          '#': '1',
          Username: 'Steve Kenobi',
          Link: 'https://osu.ppy.sh/u/1234',
          'Ranked Score': '125',
          Accuracy: '65.32',
          Playcount: '485',
          'Total Score': '8452',
          SSH: '25',
          SS: '25',
          SH: '25',
          S: '25',
          A: '25',
        },
      ]);
    });
  });

  describe.sequential('stats', () => {
    test('updateStats', async () => {
      await sheetClient.updateStats([{
        Year: '2009',
        'Total Beatmaps': '12375044',
        'Played Beatmaps': '4171323',
        'Completion (%)': '98.6',
        'Total Score': '213216521',
        'Average Score': '151621',
        SSH: '1235',
        SS: '1542',
        SH: '4212',
        S: '1232',
        A: '1',
      }]);
    });

    test('getStats', async () => {
      const result = await sheetClient.getStats();
      expect(result).toStrictEqual([{
        Year: '2009',
        'Total Beatmaps': '12375044',
        'Played Beatmaps': '4171323',
        'Completion (%)': '98.6',
        'Total Score': '213216521',
        'Average Score': '151621',
        SSH: '1235',
        SS: '1542',
        SH: '4212',
        S: '1232',
        A: '1',
      }]);
    });
  });

  describe.sequential('beatmaps of year', () => {
    test('updateBeatmapsOfYear', async () => {
      await sheetClient.updateBeatmapsOfYear('2007', [
        {
          Link: 'https://osu.ppy.sh/b/1235',
          Artist: 'artist',
          Title: 'title',
          Creator: 'creator',
          Version: 'version',
          Difficulty: '3.65',
          Status: 'ranked',
          BPM: '145',
          AR: '7.5',
          CS: '3.6',
          HP: '5',
          OD: '6',
          Length: '154',
          Rank: 'SH',
          Mods: 'HD,SD',
          Accuracy: '99.82',
          Score: '12,375,044',
        },
        {
          Link: 'https://osu.ppy.sh/b/1236',
          Artist: 'artist',
          Title: 'title',
          Creator: 'creator',
          Version: 'version',
          Difficulty: '3.65',
          Status: 'ranked',
          BPM: '145',
          AR: '9.2',
          CS: '4',
          HP: '7',
          OD: '8',
          Length: '154',
        },
      ]);
    });

    test('getBeatmapsOfYear', async () => {
      const result = await sheetClient.getBeatmapsOfYear('2007');
      expect(result).toStrictEqual([
        {
          Link: 'https://osu.ppy.sh/b/1235',
          Artist: 'artist',
          Title: 'title',
          Creator: 'creator',
          Version: 'version',
          Difficulty: '3.65',
          Status: 'ranked',
          BPM: '145',
          AR: '7.5',
          CS: '3.6',
          HP: '5',
          OD: '6',
          Length: '154',
          Rank: 'SH',
          Mods: 'HD,SD',
          Accuracy: '99.82',
          Score: '12,375,044',
        },
        {
          Link: 'https://osu.ppy.sh/b/1236',
          Artist: 'artist',
          Title: 'title',
          Creator: 'creator',
          Version: 'version',
          Difficulty: '3.65',
          Status: 'ranked',
          BPM: '145',
          AR: '9.2',
          CS: '4',
          HP: '7',
          OD: '8',
          Length: '154',
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
        { Link: 'https://osu.ppy.sh/b/123', Artist: 'artist', Title: 'title', Creator: 'creator', Version: 'version', Difficulty: '1.23', Status: 'ranked', Length: '150', Playcount: '12' },
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
    `('updates unfinished', async (obj: { method: 'updateProblematicBeatmaps' | 'updateNonSDBeatmaps' | 'updateDtBeatmaps', title: 'Problematic' | 'Non SD' | 'DT' }) => {
      await sheetClient[obj.method]([
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
