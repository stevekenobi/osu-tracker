const OsuClient = require('../../src/client/OsuClient');
const DatabaseClient = require('../../src/client/DatabaseClient');
const SheetClient = require('../../src/client/SheetClient');
const { updateLeaderboard } = require('../../src/server/helpers/leaderboard');

jest.mock('../../src/client/OsuClient');

jest.spyOn(OsuClient.prototype, 'getCountryLeaderboard').mockImplementation(async () =>
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
  }),
);

const databaseClientMock = jest.spyOn(DatabaseClient.prototype, 'addLeaderboardUsers').mockImplementation(async () => Promise.resolve());

const sheetClientMock = jest.spyOn(SheetClient.prototype, 'updateLeaderboard').mockImplementation(async () => Promise.resolve());

const osuClient = new OsuClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const databaseClient = new DatabaseClient('sqlite::memory:', false);

const sheetClient = new SheetClient('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc');

describe('leaderboard helper', () => {
  describe('updateLeaderboard', () => {
    test('updates the leaderboard', async () => {
      await updateLeaderboard(osuClient, databaseClient, sheetClient);
      expect(databaseClientMock).toHaveBeenCalledWith([
        {
          id: 2,
          username: 'ximeniez',
          rankedScore: 12375044,
          totalScore: 21554847,
          hitAccuracy: 99.56,
          playcount: 5548,
          SSH: 123,
          SS: 123,
          SH: 123,
          S: 123,
          A: 123,
        },
        {
          id: 1,
          username: 'Steve Kenobi',
          rankedScore: 4171323,
          totalScore: 21554847,
          hitAccuracy: 99.56,
          playcount: 5548,
          SSH: 123,
          SS: 123,
          SH: 123,
          S: 123,
          A: 123,
        },
        {
          id: 3,
          username: 'other',
          rankedScore: 265,
          totalScore: 21554847,
          hitAccuracy: 99.56,
          playcount: 5548,
          SSH: 123,
          SS: 123,
          SH: 123,
          S: 123,
          A: 123,
        },
      ]);
      expect(sheetClientMock).toHaveBeenCalledWith([
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
