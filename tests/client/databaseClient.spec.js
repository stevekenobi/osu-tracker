const DatabaseClient = require('../../src/client/DatabaseClient');

const client = new DatabaseClient('sqlite::memory:', true);

describe('database client', () => {
  beforeAll(async () => await client.initializeDatabase());

  describe('when sequelize singleton is not initialized', () => {
    test('throws error', async () => {
      client.sequelizeSingleton = undefined;
      expect(() => client.getSequelizeSingleton()).toThrow(Error);
    });
  });
});
