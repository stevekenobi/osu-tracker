/* eslint-disable @typescript-eslint/no-explicit-any */
import SheetClient from '../../../src/client/SheetClient';
const sheetClient = new SheetClient(
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
  '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc',
);

const getRows = vi.spyOn(sheetClient as any, 'getRows');
const addRows = vi.spyOn(sheetClient as any, 'addRows');
const clearRows = vi.spyOn(sheetClient as any, 'clearRows');
const updateCell = vi.spyOn(sheetClient as any, 'updateCell');

getRows.mockImplementation(() => {});
addRows.mockImplementation(() => {});
clearRows.mockImplementation(() => {});

describe.sequential('sheet client', () => {
  describe('errors', () => {
    const client = new SheetClient(
      '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro',
      '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro',
      '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro',
      '1X5I8SnrMQnVOQ6jRyug2Mhub81rJBb0fIVqPUNhirro',
    );
    test('getRows', () => {
      expect(() => client.getNoScoreBeatmaps()).rejects.toThrowError('Sheet No Score not found');
    });

    test('addRows', () => {
      expect(() => client.updateNoScoreBeatmaps([])).rejects.toThrowError('Sheet No Score not found');
    });

    test('clearRows', () => {
      expect(() => client.updateBeatmapsOfYear('234', [])).rejects.toThrowError('Sheet 234 not found');
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
      await sheetClient.updateStats([
        {
          Year: '2009',
          'Total Beatmaps': '12375044',
          'Played Beatmaps': '4171323',
          'Completion (%)': '98.6',
          'Total Score': '213216521',
          'Total Classic Score': '213216521',
          'Average Score': '151621',
          'Average Accuracy': '0.943',
          SSH: '1235',
          SS: '1542',
          SH: '4212',
          S: '1232',
          A: '1',
        },
      ]);

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
          'Total Classic Score': '213216521',
          'Average Score': '151621',
          SSH: '1235',
          SS: '1542',
          SH: '4212',
          S: '1232',
          A: '1',
        },
      ]);
      const result = await sheetClient.getStats();
      expect(result).toStrictEqual([
        {
          Year: '2009',
          'Total Beatmaps': '12375044',
          'Played Beatmaps': '4171323',
          'Completion (%)': '98.6',
          'Total Score': '213216521',
          'Total Classic Score': '213216521',
          'Average Score': '151621',
          SSH: '1235',
          SS: '1542',
          SH: '4212',
          S: '1232',
          A: '1',
        },
      ]);
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

  describe('updateOverallAccuracy', () => {
    test('updates accuracy cell', async () => {
      await sheetClient.updateOverallAccuracy('99.43');

      expect(updateCell).toHaveBeenCalledWith('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', 'Stats', 'G28', '99.43');
    });
  });

  describe('update unfinished beatmaps', () => {
    test.each`
      method                         | title
      ${'updateNoScoreBeatmaps'}     | ${'No Score'}
      ${'updateProblematicBeatmaps'} | ${'Problematic'}
      ${'updateNonSDBeatmaps'}       | ${'Non SD'}
      ${'updateDtBeatmaps'}          | ${'DT'}
      ${'updateArankBeatmaps'}       | ${'A Ranks'}
      ${'updateSuboptimalBeatmaps'}  | ${'Sub Optimal'}
    `(
      'updates $title',
      async (obj: {
        method: 'updateNoScoreBeatmaps' | 'updateProblematicBeatmaps' | 'updateNonSDBeatmaps' | 'updateDtBeatmaps' | 'updateArankBeatmaps' | 'updateSuboptimalBeatmaps';
        title: 'Problematic' | 'Non SD' | 'DT' | 'A Ranks' | 'Sub Optimal';
      }) => {
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
      },
    );
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

  describe('updateAges', () => {
    test('updates ages', async () => {
      await sheetClient.updateAges([{ Link: 'https://osu.ppy.sh/s/123', Artist: 'artist', Title: 'title', Creator: 'creator', Age: '1234' }], '2010');

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();

      getRows.mockResolvedValue([{ Link: 'https://osu.ppy.sh/s/123', Artist: 'artist', Title: 'title', Creator: 'creator', Age: '1234' }]);

      const result = await sheetClient.getAges('2010');
      expect(result).toStrictEqual([{ Link: 'https://osu.ppy.sh/s/123', Artist: 'artist', Title: 'title', Creator: 'creator', Age: '1234' }]);
    });
  });

  describe('updateAgeStats', () => {
    test('updates age stats', async () => {
      await sheetClient.updateAgeStats([{ Year: '2007', 'Average Age': '123', 'Oldest Age': '456', 'Youngest Age': '789', 'Oldest Map': 'olderst map', 'Youngest Map': 'youngest map' }]);

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();

      getRows.mockResolvedValue([{ Year: '2007', 'Average Age': '123', 'Oldest Age': '456', 'Youngest Age': '789', 'Oldest Map': 'olderst map', 'Youngest Map': 'youngest map' }]);

      const result = await sheetClient.getAgeStats();
      expect(result).toStrictEqual([{ Year: '2007', 'Average Age': '123', 'Oldest Age': '456', 'Youngest Age': '789', 'Oldest Map': 'olderst map', 'Youngest Map': 'youngest map' }]);
    });
  });

  describe('updateBeatmapPackStats', () => {
    test('updates packs', async () => {
      await sheetClient.updateBeatmapPackStats([{ 'Beatmap Completion': 'name', 'Completion (%)': '12.6', 'Download Link': 'https://somelink.com', Name: 'Beatmap Pack Name`' }]);

      expect(clearRows).toHaveBeenCalled();
      expect(addRows).toHaveBeenCalled();

      getRows.mockResolvedValue([{ 'Beatmap Completion': 'name', 'Completion (%)': '12.6', 'Download Link': 'https://somelink.com', Name: 'Beatmap Pack Name`' }]);

      const result = await sheetClient.getAgeStats();
      expect(result).toStrictEqual([{ 'Beatmap Completion': 'name', 'Completion (%)': '12.6', 'Download Link': 'https://somelink.com', Name: 'Beatmap Pack Name`' }]);
    });
  });
});
