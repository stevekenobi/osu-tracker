const { updateLeaderboard } = require('../../src/server/helpers/leaderboard');
const createOsuClientMock = require('../mocks/OsuClient');
const createSheetClientMock = require('../mocks/SheetClient');

const osuClient = createOsuClientMock('getCountryLeaderboard', async () =>
  Promise.resolve({
    cursor: undefined,
    ranking: [
      {
        pp: 123,
        ranked_score: 4171323,
        hit_accuracy: 99.56,
        play_count: 5548,
        total_score: 21554847,
        grade_counts: {
          ss: 123,
          ssh: 123,
          s: 123,
          sh: 123,
          a: 123,
        },
        user: {
          id: 1,
          username: 'Steve Kenobi',
        },
      },
      {
        pp: 127,
        ranked_score: 12375044,
        hit_accuracy: 99.56,
        play_count: 5548,
        total_score: 21554847,
        grade_counts: {
          ss: 123,
          ssh: 123,
          s: 123,
          sh: 123,
          a: 123,
        },
        user: {
          id: 2,
          username: 'ximeniez',
        },
      },
      {
        pp: 127,
        ranked_score: 265,
        hit_accuracy: 99.56,
        play_count: 5548,
        total_score: 21554847,
        grade_counts: {
          ss: 123,
          ssh: 123,
          s: 123,
          sh: 123,
          a: 123,
        },
        user: {
          id: 3,
          username: 'other',
        },
      },
    ],
  }),);


const sheetClient =  createSheetClientMock('updateLeaderboard', async () => Promise.resolve());

describe('leaderboard helper', () => {
  describe('updateLeaderboard', () => {
    test('updates the leaderboard', async () => {
      await updateLeaderboard(osuClient, sheetClient);
      expect(sheetClient.updateLeaderboard).toHaveBeenCalledWith([
        {
          pp: 127,
          ranked_score: 12375044,
          hit_accuracy: 99.56,
          play_count: 5548,
          total_score: 21554847,
          grade_counts: {
            ss: 123,
            ssh: 123,
            s: 123,
            sh: 123,
            a: 123,
          },
          user: {
            id: 2,
            username: 'ximeniez',
          },
        },
        {
          pp: 123,
          ranked_score: 4171323,
          hit_accuracy: 99.56,
          play_count: 5548,
          total_score: 21554847,
          grade_counts: {
            ss: 123,
            ssh: 123,
            s: 123,
            sh: 123,
            a: 123,
          },
          user: {
            id: 1,
            username: 'Steve Kenobi',
          },
        },
        {
          pp: 127,
          ranked_score: 265,
          hit_accuracy: 99.56,
          play_count: 5548,
          total_score: 21554847,
          grade_counts: {
            ss: 123,
            ssh: 123,
            s: 123,
            sh: 123,
            a: 123,
          },
          user: {
            id: 3,
            username: 'other',
          },
        },
      ]);
    });
  });
});
