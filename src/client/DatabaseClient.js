const { Sequelize } = require('sequelize');
const { initLeaderboard, Leaderboard } = require('./models/Leaderboard');

class DatabaseClient {
  sequelizeSingleton = undefined;

  /**
   * @constructor
   * @param {string} databaseUrl
   */
  constructor(databaseUrl) {
    if (this.sequelizeSingleton) {
      console.log('Already initialized');
      return;
    }

    const options = {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
        },
      },
    };

    this.sequelizeSingleton = new Sequelize(databaseUrl, process.env.DATABASE_SECURE === 'true' ? options : {});
  }

  async initializeDatabase() {
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
   * @param {Array<LeaderboardModel>} users
   */
  async addLeaderboardUsers(users) {
    await Leaderboard.destroy({ truncate: true });
    await Leaderboard.bulkCreate(users);
  }
}

module.exports = DatabaseClient;
