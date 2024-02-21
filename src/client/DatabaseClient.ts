import { Sequelize, Op } from 'sequelize';
import { initBeatmaps, Beatmaps } from './models/Beatmaps';

export default class DatabaseClient {
  sequelizeSingleton = undefined;

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

    this.sequelizeSingleton = new Sequelize(databaseUrl, databaseSecure === 'true' ? options : { logging: false });
  }

  async initializeDatabase() {
    initBeatmaps(this.getSequelizeSingleton());

    await this.getSequelizeSingleton().sync({ alter: true });
  }

  async closeConnection() {
    await this.getSequelizeSingleton().close();
  }

  getSequelizeSingleton() {
    if (!this.sequelizeSingleton) {
      throw new Error('sequelize singleton was not initialized, use initModels() first');
    }

    return this.sequelizeSingleton;
  }

  async updateBeatmaps(beatmaps) {
    await Beatmaps.bulkCreate(beatmaps, { updateOnDuplicate: ['artist', 'title', 'creator', 'version', 'difficulty', 'AR', 'CS', 'OD', 'HP', 'BPM', 'length', 'status', 'rankedDate'] });
  }

  async getBeatmaps(options) {
    return await Beatmaps.findAll(options);
  }

  async getBeatmapsOfYear(year) {
    return await Beatmaps.findAll({ where: { rankedDate: { [Op.like]: `${year}%` } } });
  }

  async getUnfinishedBeatmaps(option) {
    const result = option === 'problematic' ? await this.getProblematicBeatmaps() : option === 'non-sd' ? await this.getNonSDBeatmaps() : await this.getDTBeatmaps();
    return result.sort((a,b) => a.difficulty > b.difficulty ? 1 : -1);
  }

  async getProblematicBeatmaps() {
    return await Beatmaps.findAll({ where: { perfect: false } });
  }

  async getNonSDBeatmaps() {
    return await Beatmaps.findAll({ where: { mods: { [Op.notLike]: '%SD%' } } });
  }

  async getDTBeatmaps() {
    return await Beatmaps.findAll({ where: { mods: { [Op.like]: '%DT%' } } });
  }

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
