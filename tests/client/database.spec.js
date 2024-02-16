const { Op } = require('sequelize');
const DatabaseClient = require('../../src/client/DatabaseClient');
const { Beatmaps } = require('../../src/client/models/Beatmaps');
let databaseClient = undefined;

describe('database', () => {
  beforeAll(async () => {
    databaseClient = new DatabaseClient(process.env.PROD_DATABASE_URL, true);
    await databaseClient.initializeDatabase();
  });
  afterAll(async () => {
    await databaseClient.closeConnection();
  });

  test('all beatmaps are osu', async () => {
    const result = await Beatmaps.findAll({ where: { mode: { [Op.ne]: 'osu' } } });
    expect(result.length).toBe(0);
  });

  test('all beatmaps are ranked', async () => {
    const result = await Beatmaps.findAll({ where: { status: { [Op.notIn]: ['ranked', 'approved', 'loved' ]} } });
    expect(result.length).toBe(0);
  });
});
