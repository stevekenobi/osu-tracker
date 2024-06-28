import {
  createBeatmapLinkFromId,
  createQuery,
  createUserLinkFromId,
  delay,
  extractIdFromLink,
  getDaysFromToday,
  getDaysFromDate,
  getDiffDataFromDays,
  getModsString,
  getRulesetFromInt,
  getYearsUntilToday,
  isBeatmapRankedApprovedOrLoved,
  range,
  createBeatmapsetLinkFromId,
  calculateClassicScore,
  getNormalRank,
  calculateAverageAccuracy,
} from '../../src/utils';
import { beatmapsResult } from '../data/allBeatmaps';

describe('utils', () => {
  describe('delay', () => {
    test('does not throw', async () => {
      await delay(500);
    });
  });

  describe('range', () => {
    test('returns simple range', () => {
      const result = range(1, 10);
      expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test('returns range with step', () => {
      const result = range(1, 10, 2);
      expect(result).toStrictEqual([1, 3, 5, 7, 9]);
    });
  });

  describe('createQuery', () => {
    test('returns empty string', () => {
      const result = createQuery();
      expect(result).toStrictEqual('');
    });

    test('returns simple string', () => {
      const result = createQuery({ name: 'hello' });
      expect(result).toBe('?name=hello');
    });

    test('returns simple string from number', () => {
      const result = createQuery({ id: 1 });
      expect(result).toBe('?id=1');
    });

    test('returns complex string', () => {
      const result = createQuery({ name: 'hello', id: 2 });
      expect(result).toBe('?name=hello&id=2');
    });
  });

  describe('getYearsUntilToday', () => {
    test('returns years until today', () => {
      const result = getYearsUntilToday();
      expect(result).toStrictEqual(['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']);
    });
  });

  describe('getDaysFromToday', () => {
    test('returns correct days', () => {
      getDaysFromToday(new Date(2025, 0, 1));
    });
  });

  describe('getDaysFromDate', () => {
    test('returns correct days', () => {
      const result = getDaysFromDate('2024-03-09T06:02:55Z', '2023-04-13T20:57:35Z');
      expect(result).toBe(330);
    });
  });

  describe('getDiffDataFromDays', () => {
    test('1 day', () => {
      const result = getDiffDataFromDays('2024-03-09T06:02:55Z', '2024-03-08T06:02:55Z');
      expect(result).toBe('1 day');
    });

    test('many days', () => {
      const result = getDiffDataFromDays('2024-03-09T06:02:55Z', '2024-03-01T06:02:55Z');
      expect(result).toBe('8 days');
    });

    test('many days in different months', () => {
      const result = getDiffDataFromDays('2024-03-09T06:02:55Z', '2024-02-25T06:02:55Z');
      expect(result).toBe('13 days');
    });

    test('1 month', () => {
      const result = getDiffDataFromDays('2023-10-09T06:02:55Z', '2023-09-08T06:02:55Z');
      expect(result).toBe('1 month');
    });

    test('1 month in february', () => {
      const result = getDiffDataFromDays('2023-03-09T06:02:55Z', '2023-02-06T06:02:55Z');
      expect(result).toBe('1 month');
    });

    test('1 month in february of 2024', () => {
      const result = getDiffDataFromDays('2024-03-09T06:02:55Z', '2024-02-07T06:02:55Z');
      expect(result).toBe('1 month');
    });

    test('many months', () => {
      const result = getDiffDataFromDays('2023-10-09T06:02:55Z', '2023-07-09T06:02:55Z');
      expect(result).toBe('3 months');
    });

    test('1 year exactly', () => {
      const result = getDiffDataFromDays('2023-10-09T06:02:55Z', '2022-10-08T06:02:55Z');
      expect(result).toBe('1 year');
    });

    test('1 year exactly with 29th february', () => {
      const result = getDiffDataFromDays('2024-10-09T06:02:55Z', '2023-10-09T06:02:55Z');
      expect(result).toBe('1 year');
    });

    test('1 year and days', () => {
      const result = getDiffDataFromDays('2024-03-09T06:02:55Z', '2023-03-01T20:57:35Z');
      expect(result).toBe('1 year 7 days');
    });

    test('many years and something', () => {
      const result = getDiffDataFromDays('2022-03-09T06:02:55Z', '2015-06-20T20:57:35Z');
      expect(result).toBe('6 years 8 months 18 days');
    });
  });

  describe('isBeatmapRankedApprovedOrLoved', () => {
    describe.each([
      { input: { status: 'ranked' }, expected: true },
      { input: { status: 'approved' }, expected: true },
      { input: { status: 'loved' }, expected: true },
      { input: { status: 'graveyard' }, expected: false },
      { input: { status: 'wip' }, expected: false },
      { input: { status: 'pending' }, expected: false },
    ])('$input.status returns $expected', ({ input, expected }) => {
      test('returns correct result', () => {
        const result = isBeatmapRankedApprovedOrLoved(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('getRulesetFromInt', () => {
    test('returns osu mode', () => {
      const result = getRulesetFromInt(0);
      expect(result).toBe('osu');
    });

    test('returns unknown mode', () => {
      const result = getRulesetFromInt(1);
      expect(result).toBe('unknown');
    });
  });

  describe('getModsString', () => {
    test('returns empty string', () => {
      const result = getModsString([]);
      expect(result).toBe('');
    });

    test('returns normal string', () => {
      const result = getModsString([{ acronym: 'HD' }, { acronym: 'SD' }, { acronym: 'CL' }]);
      expect(result).toBe('HD,SD,CL');
    });

    test('returns lazer string', () => {
      const result = getModsString([{ acronym: 'HD' }, { acronym: 'SD' }, { acronym: 'NC', settings: { speed_change: 1.23 } }]);
      expect(result).toBe('HD,SD,NC(1.23)');
    });

    test('returns random string', () => {
      const result = getModsString([{ acronym: 'HD' }, { acronym: 'SD', settings: { some_setting: 123, other_setting: 'other' } }, { acronym: 'NC', settings: { speed_change: 1.23 } }]);
      expect(result).toBe('HD,SD(123,other),NC(1.23)');
    });
  });

  describe('createBeatmapLinkFromId', () => {
    test('returns correct link', () => {
      const result = createBeatmapLinkFromId(123);
      expect(result).toBe('https://osu.ppy.sh/b/123');
    });
  });

  describe('createBeatmapsetLinkFromId', () => {
    test('returns correct link', () => {
      const result = createBeatmapsetLinkFromId(123);
      expect(result).toBe('https://osu.ppy.sh/s/123');
    });
  });

  describe('createUserLinkFromId', () => {
    test('returns correct link', () => {
      const result = createUserLinkFromId(456);
      expect(result).toBe('https://osu.ppy.sh/u/456');
    });
  });

  describe('extractIdFromLink', () => {
    test('returns correct id', () => {
      const result = extractIdFromLink('https://osu.ppy.sh/u/123');
      expect(result).toBe(123);
    });

    test('returns wrong result', () => {
      const result = extractIdFromLink('https://osu.ppy.sh/u');
      expect(result).toBe(NaN);
    });

    test('returns wrong result', () => {
      const result = extractIdFromLink('');
      expect(result).toBe(0);
    });
  });

  describe('calculateClassicScore', () => {
    test('returns correct full result', () => {
      const result = calculateClassicScore({
        total_score: 1014523,
        statistics: {
          great: 1205,
          miss: 2,
          ok: 23,
          meh: 2,
        },
      });
      expect(result).toBe(50254932);
    });

    test('returns correct result great', () => {
      const result = calculateClassicScore({
        total_score: 1014523,
        statistics: {
          great: 1205,
        },
      });
      expect(result).toBe(48080735);
    });

    test('returns correct result ok', () => {
      const result = calculateClassicScore({
        total_score: 1014523,
        statistics: {
          ok: 1205,
        },
      });
      expect(result).toBe(48080735);
    });

    test('returns correct result meh', () => {
      const result = calculateClassicScore({
        total_score: 1014523,
        statistics: {
          meh: 1205,
        },
      });
      expect(result).toBe(48080735);
    });

    test('returns correct result miss', () => {
      const result = calculateClassicScore({
        total_score: 1014523,
        statistics: {
          miss: 1205,
        },
      });
      expect(result).toBe(48080735);
    });
  });

  describe('getNormalRank', () => {
    test('returns SS rank', () => {
      const result = getNormalRank('X');
      expect(result).toBe('SS');
    });

    test('returns SSH rank', () => {
      const result = getNormalRank('XH');
      expect(result).toBe('SSH');
    });

    test('returns default rank', () => {
      const result = getNormalRank('A');
      expect(result).toBe('A');
    });
  });

  describe('calculateAverageAccuracy', () => {
    test('returns accuracy', () => {
      const result = calculateAverageAccuracy(beatmapsResult);
      expect(result).toBe(0.9874432303610774);
    });
  });
});
