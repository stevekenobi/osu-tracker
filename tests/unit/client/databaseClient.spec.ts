import DatabaseClient from '../../../src/client/DatabaseClient';
import {
  beatmapsResult,
  beatmapsOfYearResult,
  problematicBeatmapsResult,
  nonSDBeatmapsResult,
  dtBeatmapsResult,
  aRanksResult,
  suboptimalResult,
  unfinishedBeamapsResult,
} from '../../data/allBeatmaps';
import { beatmapData } from '../../data/beatmaps';
import { scoreData } from '../../data/scores';

const client = new DatabaseClient('sqlite::memory', 'false');

describe.sequential('database client', () => {
  beforeAll(() => client.initializeDatabase());
  afterAll(async () => client.closeConnection());
  describe('updateBeatmaps', () => {
    test('executes query', async () => {
      await client.updateBeatmaps(beatmapData);
      const result = await client.getBeatmaps();
      expect(result.length).toEqual(100);
    });
  });

  describe('addUnfinishedBeatmap', () => {
    test('executes query', async () => {
      await client.addUnfinishedBeatmap(2328);
    });
  });

  describe('updateScore', () => {
    test('executes query', async () => {
      for (const s of scoreData) {
        await client.updateScore(s);
      }
    });
  });

  describe('updating score with less score', () => {
    test('does not update', async () => {
      await client.updateScore({
        id: 1752,
        unfinished: false,
        accuracy: 99.18,
        max_combo: 868,
        perfect: true,
        pp: 155.91,
        score: 123,
        count_ok: 34,
        count_great: 3,
        count_meh: 9,
        count_miss: 5432,
        mode: 'osu',
        mods: 'HD',
        rank: 'A',
      });
    });
  });

  describe('updating score with greater score', () => {
    test('updates score', async () => {
      await client.updateScore({
        id: 319,
        unfinished: false,
        accuracy: 98.86,
        max_combo: 689,
        perfect: false,
        pp: 137.19,
        score: 23632046,
        count_ok: 8,
        count_great: 1528,
        count_meh: 0,
        count_miss: 0,
        mode: 'osu',
        mods: 'HD,SD',
        rank: 'XH',
      });
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
      { input: 'no-score', expected: unfinishedBeamapsResult },
      { input: 'problematic', expected: problematicBeatmapsResult },
      { input: 'non-sd', expected: nonSDBeatmapsResult },
      { input: 'dt', expected: dtBeatmapsResult },
      { input: 'a-ranks', expected: aRanksResult },
      { input: 'sub-optimal', expected: suboptimalResult },
      { input: 'unknown', expected: [] },
    ])('$input', ({ input, expected }) => {
      test('returns correct result', async () => {
        const result = await client.getUnfinishedBeatmaps(input as 'no-score' | 'problematic' | 'non-sd' | 'dt' | 'a-ranks' | 'sub-optimal');
        expect(result).toEqual(expected);
      });
    });
  });

  describe('updating score on non-existant map', () => {
    test('throws error', () => {
      expect(() =>
        client.updateScore({
          id: 10,
          unfinished: false,
          accuracy: 98.86,
          max_combo: 689,
          perfect: false,
          pp: 137.19,
          score: 3632046,
          count_ok: 7,
          count_great: 528,
          count_meh: 4,
          count_miss: 2,
          mode: 'osu',
          mods: 'HD,SD',
          rank: 'A',
        }),
      ).rejects.toThrowError('beatmap 10 not found in database');
    });
  });

  describe('updating unfinished on non-existant map', () => {
    test('throws error', () => {
      expect(() => client.addUnfinishedBeatmap(10)).rejects.toThrowError('beatmap 10 not found in database');
    });
  });
});

describe('database singleton', () => {
  test('throws error', () => {
    expect(() => client.getSequelizeSingleton()).toThrowError('sequelize singleton was not initialized, use initModels() first');
  });
});
