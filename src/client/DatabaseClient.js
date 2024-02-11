const { Sequelize } = require('sequelize');
const { initLeaderboard, Leaderboard } = require('./models/Leaderboard');
const { initBeatmaps, Beatmaps } = require('./models/Beatmaps');

class DatabaseClient {
  sequelizeSingleton = undefined;

  /**
   * @constructor
   * @param {string} databaseUrl
   * @param {boolean} databaseSecure
   */
  constructor(databaseUrl, databaseSecure) {
    const options = {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
        },
      },
    };

    /* c8 ignore start */
    this.sequelizeSingleton = new Sequelize(databaseUrl, databaseSecure ? options : {});
    /* c8 ignore end */
  }

  async initializeDatabase() {
    initBeatmaps(this.getSequelizeSingleton());
    initLeaderboard(this.getSequelizeSingleton());

    await this.getSequelizeSingleton().sync({ alter: true });
  }

  /**
   * @returns {Sequelize}
   */
  getSequelizeSingleton() {
    if (!this.sequelizeSingleton) {
      throw new Error('sequelize singleton was not initialized, use initModels() first');
    }

    return this.sequelizeSingleton;
  }

  /**
   * @param {LeaderboardModel[]} users
   * @returns {Promise<void>}
   */
  async addLeaderboardUsers(users) {
    await Leaderboard.destroy({ truncate: true });
    await Leaderboard.bulkCreate(users);
  }

  /**
   * @returns {Promise<Leaderboard[]>}
   */
  async getLeaderboardUsers() {
    return await Leaderboard.findAll();
  }

  /**
   * @param {BeatmapModel[]} beatmaps
   * @returns {Promise<void>}
   */
  async updateBeatmaps(beatmaps) {
    await Beatmaps.bulkCreate(beatmaps, { updateOnDuplicate: ['artist', 'title', 'creator', 'version', 'AR', 'CS', 'OD', 'HP', 'BPM', 'rankedDate'] });
  }
}

module.exports = DatabaseClient;
