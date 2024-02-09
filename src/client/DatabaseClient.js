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

    this.sequelizeSingleton = new Sequelize(databaseUrl, process.env.database_secure === 'true' ? options : {});
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
   * @param {Array<OsuRanking>} users
   */
  async addLeaderboardUsers(users) {
    await Leaderboard.destroy({ truncate: true });
    await Leaderboard.bulkCreate(
      users.map((u) => ({
        id: u.user.id,
        username: u.user.username,
        rankedScore: u.ranked_score,
        totalScore: u.total_score,
        hitAccuracy: u.hit_accuracy,
        playcount: u.play_count,
        SSH: u.grade_counts.ssh,
        SS: u.grade_counts.ss,
        SH: u.grade_counts.sh,
        S: u.grade_counts.s,
        A: u.grade_counts.a,
      })),
    );
  }
}

module.exports = DatabaseClient;
