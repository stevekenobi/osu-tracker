import DatabaseClient from '../../../src/client/DatabaseClient';
import { beatmapsOfYearResult, beatmapsResult, dtBeatmapsResult, nonSDBeatmapsResult, problematicBeatmapsResult } from '../../data/allBeatmaps';
import { beatmapData } from '../../data/beatmaps';
import { scoreData } from '../../data/scores';

const client = new DatabaseClient('sqlite::memory', 'false');

describe.sequential('database client', () => {
  beforeAll(async () => await client.initializeDatabase());
  afterAll(async () => client.closeConnection());
  describe('updateBeatmaps', () => {
    test('executes query', async () => {
      await client.updateBeatmaps(beatmapData);
      const result = await client.getBeatmaps();
      expect(result.length).toEqual(100);
    });
  });

  describe('updateScore', () => {
    test('executes query', async () => {
      scoreData.forEach(async s =>
        await client.updateScore(s));
    });
  });

  describe('getBeatmaps', () => {
    test('executes query', async () => {
      const result = await client.getBeatmaps();
      expect(result).toEqual(beatmapsResult);
    });
  });

  describe('getBeatmapsOfYear', () => {
    test('executes query', async () => {
      const result = await client.getBeatmapsOfYear('2007');
      expect(result).toEqual(beatmapsOfYearResult);
    });
  });

  describe('getUnfinishedBeatmaps', () => {
    describe.each([
      { input: 'problematic', expected: problematicBeatmapsResult },
      { input: 'non-sd', expected: nonSDBeatmapsResult },
      { input: 'dt', expected: dtBeatmapsResult },
    ])('$input', ({ input, expected }) => {
      test('returns correct result', async () => {
        const result = await client.getUnfinishedBeatmaps(input as 'problematic' | 'non-sd' | 'dt');
        expect(result).toEqual(expected);
      });
    });
  });

  describe('updating score on non-existant map', () => {
    test('throws error', () => {
      expect(async () => await client.updateScore({
        id: 10, 
        'accuracy': 98.86,
        'max_combo': 689,
        'perfect': false,
        'pp': 137.19,
        'score': 3632046,
        'count_100': 7,
        'count_300': 528,
        'count_50': 4,
        'count_miss': 2,
        'mode': 'osu',
        'mods': 'HD,SD',
        'rank': 'A',
      })).rejects.toThrowError('beatmap 10 not found in database');
    });
  });
});

describe('database singleton', () => {
  test('throws error', () => {
    expect(() => client.getSequelizeSingleton()).toThrowError('sequelize singleton was not initialized, use initModels() first');
  });
});
