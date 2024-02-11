const { range, createQuery, getYearsUntilToday, isBeatmapRankedApprovedOrLoved, createBeatmapLinkFromId, createUserLinkFromId, extractIdFromLink, delay } = require('../../src/utils');

describe('utils', () => {
  describe('delay', () => {
    test('does not throw', async () => {
      await delay(100);
    });
  });
  describe('range', () => {
    test('returns all numbers from 1 to 10', () => {
      const result = range(1, 10);
      expect(result.length).toBe(10);
    });
  });

  describe('createQuery', () => {
    test('returns empty string query', () => {
      const result = createQuery();
      expect(result).toBe('');
    });

    test('returns string with one field', () => {
      const result = createQuery({ arg: 'hello' });
      expect(result).toBe('?arg=hello');
    });

    test('returns string with multiple fields', () => {
      const result = createQuery({ arg: 'hello', second: 1234 });
      expect(result).toBe('?arg=hello&second=1234');
    });
  });

  describe('getYearsUntilToday', () => {
    test('returns years from 2007 to today', () => {
      const result = getYearsUntilToday();
      expect(result).toStrictEqual(['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']);
    });
  });

  describe('isBeatmapRankedApprovedOrLoved', () => {
    test.each`
      status
      ${'ranked'}
      ${'approved'}
      ${'loved'}
    `('returns true', (obj) => {
      const result = isBeatmapRankedApprovedOrLoved(obj);
      expect(result).toBeTruthy();
    });

    test.each`
      status
      ${'graveyard'}
      ${'pending'}
      ${'wip'}
    `('returns false', (obj) => {
      const result = isBeatmapRankedApprovedOrLoved(obj);
      expect(result).toBeFalsy();
    });
  });

  describe('createBeatmapLinkFromId', () => {
    test('returns link', () => {
      const result = createBeatmapLinkFromId(1754);
      expect(result).toBe('https://osu.ppy.sh/b/1754');
    });
  });

  describe('createUserLinkFromId', () => {
    test('returns link', () => {
      const result = createUserLinkFromId(1754);
      expect(result).toBe('https://osu.ppy.sh/u/1754');
    });
  });

  describe('extractIdFromLink', () => {
    test.each`
      link                              | expected
      ${'https://osu.ppy.sh/u/1754'}   | ${1754}
      ${'https://osu.ppy.sh/b/175454'} | ${175454}
    `('returns number', (obj) => {
      const result = extractIdFromLink(obj.link);
      expect(result).toBe(obj.expected);
    });

    test('returns NaN', () => {
      const result = extractIdFromLink('https://osu.ppy.sh/u/asd');
      expect(isNaN(result)).toBeTruthy();
    });
  });
});
