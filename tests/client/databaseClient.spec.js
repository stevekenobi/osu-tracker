const DatabaseClient = require('../../src/client/DatabaseClient');

let client = new DatabaseClient('sqlite::memory:', true);
client = new DatabaseClient('sqlite::memory:', false);

describe('database client', () => {
  beforeAll(async () => await client.initializeDatabase());

  describe('addLeaderboardUsers', () => {
    test('adds new leaderboard users', async () => {
      await client.addLeaderboardUsers([
        {
          id: 1,
          username: 'username',
          rankedScore: 4171323,
          totalScore: 12375044,
          hitAccuracy: 98.32,
          playcount: 123456789,
          SSH: 727,
          SS: 726,
          SH: 725,
          S: 724,
          A: 723,
        },
      ]);
    });
  });

  describe('getLeaderboardUsers', () => {
    test('returns the users', async () => {
      const response = await client.getLeaderboardUsers();
      expect(response.length).toBe(1);

      expect(response[0].id).toBe(1);
      expect(response[0].username).toBe('username');
      expect(response[0].rankedScore).toBe(4171323);
      expect(response[0].totalScore).toBe(12375044);
      expect(response[0].hitAccuracy).toBe(98.32);
      expect(response[0].playcount).toBe(123456789);
      expect(response[0].SSH).toBe(727);
      expect(response[0].SS).toBe(726);
      expect(response[0].SH).toBe(725);
      expect(response[0].S).toBe(724);
      expect(response[0].A).toBe(723);
    });
  });

  describe('when sequelize singleton is not initialized', () => {
    test('throws error', async () => {
      client.sequelizeSingleton = undefined;
      expect(() => client.getSequelizeSingleton()).toThrow(Error);
    });
  });
});
