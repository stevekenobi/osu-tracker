import { createBeatmapLinkFromId, createQuery, createUserLinkFromId, delay, extractIdFromLink, getYearsUntilToday, isBeatmapRankedApprovedOrLoved, range } from '../../src/utils';

describe('utils', () => {
  describe('delay', () => {
    test('does not throw', async () => {
      await delay(500);
    });
  });

  describe('range', () => {
    test('returns simple range', () => {
      const result = range(1,10);
      expect(result).toStrictEqual([1,2,3,4,5,6,7,8,9,10]);
    });

    test('returns range with step', () => {
      const result = range(1,10, 2);
      expect(result).toStrictEqual([1,3,5,7,9]);
    });
  });

  describe('createQuery', () => {
    test('returns empty string', () => {
      const result = createQuery();
      expect(result).toStrictEqual('');
    });

    test('returns simple string', () => {
      const result = createQuery({name: 'hello'});
      expect(result).toBe('?name=hello');
    });

    test('returns simple string from number', () => {
      const result = createQuery({id: 1});
      expect(result).toBe('?id=1');
    });

    test('returns complex string', () => {
      const result = createQuery({name: 'hello', id: 2});
      expect(result).toBe('?name=hello&id=2');
    });
  });

  describe('getYearsUntilToday', () => {
    test('returns years until today', () => {
      const result = getYearsUntilToday();
      expect(result).toStrictEqual([
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
        '2016',
        '2017',
        '2018',
        '2019',
        '2020',
        '2021',
        '2022',
        '2023',
        '2024',
      ]);
    });
  });

  describe('isBeatmapRankedApprovedOrLoved', () => {
    describe.each([
      {input: {status: 'ranked'}, expected: true},
      {input: {status: 'approved'}, expected: true},
      {input: {status: 'loved'}, expected: true},
      {input: {status: 'graveyard'}, expected: false},
      {input: {status: 'wip'}, expected: false},
      {input: {status: 'pending'}, expected: false},
    ])('$input.status returns $expected', ({input, expected}) => {
      test('returns correct result', () => {
        const result = isBeatmapRankedApprovedOrLoved(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('createBeatmapLinkFromId', () => {
    test('returns correct link', () => {
      const result = createBeatmapLinkFromId(123);
      expect(result).toBe('https://osu.ppy.sh/b/123');
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
});
