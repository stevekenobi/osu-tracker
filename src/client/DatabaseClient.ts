import type { FindOptions } from 'sequelize';
import { Sequelize, Op } from 'sequelize';
import { initBeatmaps, Beatmaps } from './models/Beatmaps';
import type { AppBeatmap, AppScore } from '../types';

export default class DatabaseClient {
  private sequelizeSingleton: Sequelize | undefined = undefined;

  constructor(databaseUrl: string, databaseSecure: string) {
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

  async initializeDatabase(): Promise<void> {
    initBeatmaps(this.getSequelizeSingleton());

    await this.getSequelizeSingleton().sync({ alter: true });
  }

  async closeConnection(): Promise<void> {
    await this.getSequelizeSingleton().close();
  }

  getSequelizeSingleton(): Sequelize {
    if (!this.sequelizeSingleton) {
      throw new Error('sequelize singleton was not initialized, use initModels() first');
    }

    return this.sequelizeSingleton;
  }

  async updateBeatmaps(beatmaps: AppBeatmap[]): Promise<void> {
    await Beatmaps.bulkCreate(beatmaps, { updateOnDuplicate: ['artist', 'title', 'creator', 'version', 'difficulty', 'AR', 'CS', 'OD', 'HP', 'BPM', 'length', 'status', 'rankedDate'] });
  }

  async getBeatmaps(options?: FindOptions<Beatmaps>): Promise<Beatmaps[]> {
    return await Beatmaps.findAll(options);
  }

  async getBeatmapsOfYear(year: string): Promise<Beatmaps[]> {
    return await Beatmaps.findAll({ where: { rankedDate: { [Op.like]: `${year}%` } } });
  }

  async getUnfinishedBeatmaps(option: 'problematic' | 'non-sd' | 'dt'): Promise<Beatmaps[]> {
    const result = option === 'problematic' ? await this.getProblematicBeatmaps() : option === 'non-sd' ? await this.getNonSDBeatmaps() : await this.getDTBeatmaps();
    return result.sort((a, b) => a.difficulty > b.difficulty ? 1 : -1);
  }

  async getProblematicBeatmaps(): Promise<Beatmaps[]> {
    return await Beatmaps.findAll({ where: { perfect: false } });
  }

  async getNonSDBeatmaps(): Promise<Beatmaps[]> {
    return await Beatmaps.findAll({ where: { mods: { [Op.notLike]: '%SD%' } } });
  }

  async getDTBeatmaps(): Promise<Beatmaps[]> {
    return await Beatmaps.findAll({ where: { mods: { [Op.like]: '%DT%' } } });
  }

  async updateScore(score: AppScore): Promise<void> {
    const beatmap = await Beatmaps.findByPk(score.id);
    if (!beatmap) throw new Error(`beatmap ${score.id} not found in database`);

    await Beatmaps.update(score, { where: { id: score.id } });
  }
}
