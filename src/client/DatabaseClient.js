const { Sequelize, Op } = require('sequelize');
const { initBeatmaps, Beatmaps } = require('./models/Beatmaps');

class DatabaseClient {
  sequelizeSingleton = undefined;

  /**
   * @constructor
   * @param {string} databaseUrl
   * @param {string} databaseSecure
   */
  constructor(databaseUrl, databaseSecure) {
    const options = {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
        },
      },
      logging: false,
    };

    /* c8 ignore start */
    this.sequelizeSingleton = new Sequelize(databaseUrl, databaseSecure === 'true' ? options : { logging: false });
    /* c8 ignore end */
  }

  async initializeDatabase() {
    initBeatmaps(this.getSequelizeSingleton());

    await this.getSequelizeSingleton().sync({ alter: true });
  }

  async closeConnection() {
    await this.getSequelizeSingleton().close();
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
   * @returns {Promise<Beatmaps[]>}
   */
  async getBeatmapsOfYear(year) {
    return await Beatmaps.findAll({ where: { rankedDate: { [Op.like]: `${year}%` } } });
  }

  /**
   * @returns {Promise<Beatmaps[]>}
   */
  async getUnfinishedBeatmaps(option) {
    const result = option === 'problematic' ? await this.getProblematicBeatmaps() : option === 'non-sd' ? await this.getNonSDBeatmaps() : await this.getDTBeatmaps();
    return result.sort((a,b) => a.difficulty > b.difficulty ? 1 : -1);
  }

  /**
   * @returns {Promise<Beatmaps[]>}
   */
  async getProblematicBeatmaps() {
    return await Beatmaps.findAll({ where: { perfect: false } });
  }

  /**
   * @returns {Promise<Beatmaps[]>}
   */
  async getNonSDBeatmaps() {
    return await Beatmaps.findAll({ where: { mods: { [Op.notLike]: '%SD%' } } });
  }

  /**
   * @returns {Promise<Beatmaps[]>}
   */
  async getDTBeatmaps() {
    return await Beatmaps.findAll({ where: { mods: { [Op.like]: '%DT%' } } });
  }

  /**
   * @param {number[]} ids
   * @returns {boolean}
   */
  async beatmapsExists(ids) {
    await Beatmaps.findAndCountAll({
      where: {
        [Op.or]: ids.map((i) => ({ id: i })),
      },
    });
  }

  async updateScore(score) {
    const beatmap = await Beatmaps.findByPk(score.id);
    if (!beatmap) throw new Error(`beatmap ${score.id} not found in database`);

    await Beatmaps.update(score, { where: { id: score.id } });
  }
}

module.exports = DatabaseClient;
