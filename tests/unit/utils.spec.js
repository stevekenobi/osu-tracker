const { range, createQuery, getYearsUntilToday, isBeatmapRankedApprovedOrLoved, createBeatmapLinkFromId, createUserLinkFromId, extractIdFromLink } = require('../../src/utils');

describe('utils', () => {
  describe('range', () => {
    test('returns correct array number', () => {
      const result = range(1, 10);
      expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('createQuery', () => {
    test('creates empty string from null', () => {
      const result = createQuery();
      expect(result).toBe('');
    });

    test('creates string from single property', () => {
      const result = createQuery({ first: 'first' });
      expect(result).toBe('?first=first');
    });

    test('creates string from multiple properties', () => {
      const result = createQuery({ first: 'first', num: 1234, second: 'second' });
      expect(result).toBe('?first=first&num=1234&second=second');
    });
  });

  describe('getYearsUntilToday', () => {
    test('returns all year strings', () => {
      const result = getYearsUntilToday();
      expect(result).toStrictEqual(['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']);
    });
  });
});
