/* eslint-disable @typescript-eslint/no-explicit-any */
import SheetClient from '../../../src/client/SheetClient';
import { delay } from '../../../src/utils';

const sheetClient = new SheetClient('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc');

const getRows = vi.spyOn(sheetClient as any, 'getRows');
const addRows = vi.spyOn(sheetClient as any, 'addRows');
const clearRows = vi.spyOn(sheetClient as any, 'clearRows');

getRows.mockImplementation(() => {});
addRows.mockImplementation(() => {});
clearRows.mockImplementation(() => {});

describe.sequential('sheet client', () => {
  describe('errors', () => {
    const client = new SheetClient('1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro', '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro', '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro', '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro');
    test('getRows', () => {
      expect(async () => await client.getNoScoreBeatmaps()).rejects.toThrowError('Sheet No Score not found');
    });

    test('addRows', () => {
      expect(async () => await client.updateMissingBeatmaps([])).rejects.toThrowError('Sheet Missing not found');
    });

    test('clearRows', () => {
      expect(async () => await client.updateBeatmapsOfYear('234', [])).rejects.toThrowError('Sheet 234 not found');
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('leaderboard', () => {
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

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();
    });

    test('getLeaderboard', async () => {
      getRows.mockResolvedValue([
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

  describe('stats', () => {
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

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();
    });

    test('getStats', async () => {
      getRows.mockResolvedValue([
        {
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
        },
      ]);
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

  describe('beatmaps of year', () => {
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

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();
    });

    test('getBeatmapsOfYear', async () => {
      getRows.mockResolvedValue([
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
      expect(clearRows).toHaveBeenCalled();

      await sheetClient.updateMissingBeatmaps([1, 2, 3, 4, 5, 6, 7]);
      expect(addRows).toHaveBeenCalled();
    });
  });

  describe('getMissingBeatmaps', () => {
    test('returns missing beatmap ids', async () => {
      getRows.mockResolvedValue([
        { Id: '1' },
        { Id: '2' },
        { Id: '3' },
        { Id: '4' },
        { Id: '5' },
        { Id: '6' },
        { Id: '7' },
      ]);
      const result = await sheetClient.getMissingBeatmaps();
      expect(result).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });
  });

  describe('updateNoScoreBeatmaps', () => {
    test('updates no score beatmaps', async () => {
      await sheetClient.updateNoScoreBeatmaps([
        { Link: 'https://osu.ppy.sh/b/123', Artist: 'artist', Title: 'title', Creator: 'creator', Version: 'version', Difficulty: '1.23', Status: 'ranked', Length: '150', Playcount: '12' },
      ]);

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();

      getRows.mockResolvedValue([
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
      ${'updateArankBeatmaps'}       | ${'A Ranks'}
      ${'updateSuboptimalBeatmaps'}  | ${'Sub Optimal'}
    `('updates $title', async (obj: { method: 'updateProblematicBeatmaps' | 'updateNonSDBeatmaps' | 'updateDtBeatmaps' | 'updateArankBeatmaps' | 'updateSuboptimalBeatmaps', title: 'Problematic' | 'Non SD' | 'DT' | 'A Ranks' | 'Sub Optimal' }) => {
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

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();
      getRows.mockResolvedValue([
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

      await delay(3000);

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

  describe('updateTargets', () => {
    test('updates targets', async () => {
      await sheetClient.updateTargets([{ Target: 'some target', 'Score to Earn': '123456', 'Target Score': '123456789' }]);

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();

      getRows.mockResolvedValue([{ Target: 'some target', 'Score to Earn': '123456', 'Target Score': '123456789' }]);

      const result = await sheetClient.getTargets();
      expect(result).toStrictEqual([{ Target: 'some target', 'Score to Earn': '123456', 'Target Score': '123456789' }]);
    });
  });
});
