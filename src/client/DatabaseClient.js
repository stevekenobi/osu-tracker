const { Sequelize } = require('sequelize');
const { initLeaderboard, Leaderboard } = require('./models/Leaderboard');
const { initBeatmaps, Beatmaps } = require('./models/Beatmaps');
const { initScores, Scores } = require('./models/Scores');

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
      logging: false
    };

    /* c8 ignore start */
    this.sequelizeSingleton = new Sequelize(databaseUrl, databaseSecure ? options : {logging: false});
    /* c8 ignore end */
  }

  async initializeDatabase() {
    initBeatmaps(this.getSequelizeSingleton());
    initLeaderboard(this.getSequelizeSingleton());
    initScores(this.getSequelizeSingleton());

    Beatmaps.hasOne(Scores, {foreignKey: 'beatmap_id'});
    Scores.belongsTo(Beatmaps);

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
    await Beatmaps.bulkCreate(beatmaps, { updateOnDuplicate: ['artist', 'title', 'creator', 'version', 'difficulty', 'AR', 'CS', 'OD', 'HP', 'BPM', 'length', 'status', 'rankedDate'] });
  }

  /**
   * @returns {Promise<Beatmaps[]>}
   */
  async getBeatmaps(options) {
    return await Beatmaps.findAll(options);
  }

  async updateScores(scores) {
    await Scores.bulkCreate(scores, {updateOnDuplicate: [
      'accuracy',
      'max_combo',
      'mode',
      'mods',
      'perfect',
      'pp',
      'rank',
      'score',
      'count_100',
      'count_300',
      'count_50',
      'count_miss',
    ] });
  }
}

module.exports = DatabaseClient;
