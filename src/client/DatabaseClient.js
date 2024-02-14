const { Sequelize, Op } = require('sequelize');
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
      logging: false
    };

    /* c8 ignore start */
    this.sequelizeSingleton = new Sequelize(databaseUrl, databaseSecure ? options : {logging: false});
    /* c8 ignore end */
  }

  async initializeDatabase() {
    initBeatmaps(this.getSequelizeSingleton());

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

  /**
   * @param {number[]} ids
   * @returns {boolean}
   */
  async beatmapsExists(ids) {
    await Beatmaps.findAndCountAll({
      where: {
        [Op.or]: ids.map(i => ({id: i}))
      }
    });
  }

  async updateScore(score) {
    const beatmap = await Beatmaps.findByPk(score.id);
    if (!beatmap) throw new Error(`beatmap ${score.id} not found in database`);
 
    await Beatmaps.update(score, {where: {id: score.id}});
  }
}

module.exports = DatabaseClient;
