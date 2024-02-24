import DatabaseClient from '../../../src/client/DatabaseClient';

const client = new DatabaseClient('sqlite::memory', 'false');

describe.sequential('database client', () => {
  beforeAll(async () => await client.initializeDatabase());
  afterAll(async () => client.closeConnection());
  describe('updateBeatmaps', () => {
    test('executes query', async () => {
      await client.updateBeatmaps([{
        id: 2132330,
        beatmapsetId: 979592,
        artist: 'Ito Kanako',
        title: 'Fates Fall -Kibou no Kage- (Ending Version)',
        creator: 'SaltyLucario',
        version: 'Hard',
        difficulty: 3.54,
        AR: 7.8,
        CS: 3.8,
        OD: 6,
        HP: 4,
        BPM: 180,
        length: 84,
        mode: 'osu',
        status: 'ranked',
        rankedDate: '2019-09-19T17:41:51Z',
      }, {
        id: 1041728,
        beatmapsetId: 488631,
        artist: 'Gareth Coker',
        title: 'The Spirit Tree (feat. Aeralie Brighton)',
        creator: 'Phyloukz',
        version: 'Spirit Tree',
        difficulty: 2.65,
        AR: 6,
        CS: 4.5,
        OD: 4,
        HP: 3,
        BPM: 110,
        length: 88,
        mode: 'osu',
        status: 'ranked',
        rankedDate: '2016-09-15T20:20:09Z',
      }]);
    });
  });

  describe('updateScore', () => {
    test('executes query', async () => {
      await client.updateScore({
        id: 1041728,
        mode: 'osu',
        accuracy: 98.75,
        max_combo: 585,
        mods: 'HD,SD,NC',
        perfect: true,
        pp: 88.6,
        rank: 'SH',
        score: 12375044,
        count_100: 2,
        count_300: 571,
        count_50: 0,
        count_miss: 0,
      });
    });
  });

  describe('getBeatmaps', () => {
    test('executes query', async () => {
      const result = await client.getBeatmaps();
      expect(result).toStrictEqual([{
        id: 1041728,
        beatmapsetId: 488631,
        artist: 'Gareth Coker',
        title: 'The Spirit Tree (feat. Aeralie Brighton)',
        creator: 'Phyloukz',
        version: 'Spirit Tree',
        difficulty: 2.65,
        AR: 6,
        CS: 4.5,
        OD: 4,
        accuracy: 98.75,
        max_combo: 585,
        mods: 'HD,SD,NC',
        perfect: true,
        pp: 88.6,
        rank: 'SH',
        score: 12375044,
        count_100: 2,
        count_300: 571,
        count_50: 0,
        count_miss: 0,
        HP: 3,
        BPM: 110,
        length: 88,
        mode: 'osu',
        status: 'ranked',
        rankedDate: '2016-09-15T20:20:09Z',
      }, 
      {
        id: 2132330,
        beatmapsetId: 979592,
        artist: 'Ito Kanako',
        title: 'Fates Fall -Kibou no Kage- (Ending Version)',
        creator: 'SaltyLucario',
        version: 'Hard',
        difficulty: 3.54,
        AR: 7.8,
        CS: 3.8,
        OD: 6,
        HP: 4,
        BPM: 180,
        length: 84,
        mode: 'osu',
        status: 'ranked',
        rankedDate: '2019-09-19T17:41:51Z',
        accuracy: null,
        max_combo: null,
        mods: null,
        perfect: null,
        pp: null,
        rank: null,
        score: null,
        count_100: null,
        count_300: null,
        count_50: null,
        count_miss: null,
      },]);
    });
  });

  describe('getBeatmapsOfYear', () => {
    test('executes query', async () => {
      const result = await client.getBeatmapsOfYear('2019');
      expect(result).toStrictEqual([{
        id: 2132330,
        beatmapsetId: 979592,
        artist: 'Ito Kanako',
        title: 'Fates Fall -Kibou no Kage- (Ending Version)',
        creator: 'SaltyLucario',
        version: 'Hard',
        difficulty: 3.54,
        AR: 7.8,
        CS: 3.8,
        OD: 6,
        HP: 4,
        accuracy: null,
        max_combo: null,
        mods: null,
        perfect: null,
        pp: null,
        rank: null,
        score: null,
        count_100: null,
        count_300: null,
        count_50: null,
        count_miss: null,
        BPM: 180,
        length: 84,
        mode: 'osu',
        status: 'ranked',
        rankedDate: '2019-09-19T17:41:51Z',
      }]);
    });
  });

  // describe('getUnfinishedBeatmaps', () => {
  //   test('executes query', async () => {
  //     await client.getUnfinishedBeatmaps();
  //   });
  // });

  // describe('getProblematicBeatmaps', () => {
  //   test('executes query', async () => {
  //     await client.getProblematicBeatmaps();
  //   });
  // });

  // describe('getNonSDBeatmaps', () => {
  //   test('executes query', async () => {
  //     await client.getNonSDBeatmaps();
  //   });
  // });

  // describe('getDTBeatmaps', () => {
  //   test('executes query', async () => {
  //     await client.getDTBeatmaps();
  //   });
  // });

});
