import type { FindOptions } from 'sequelize';
import { Sequelize, Op } from 'sequelize';
import { initBeatmaps, Beatmaps } from './models/Beatmaps';
import type { AppBeatmap, AppScore } from '../types';

type TrackerOptions = {
  dialectOptions: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  logging: boolean;
};

export default class DatabaseClient {
  private sequelizeSingleton: Sequelize | undefined = undefined;

  constructor(databaseUrl: string, databaseSecure: string) {
    const options: TrackerOptions = {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
        },
      },
      logging: false,
    };

    /* istanbul ignore next @preserve */
    if (databaseSecure === 'false') {
      delete options.dialectOptions.ssl;
    }

    this.sequelizeSingleton = new Sequelize(databaseUrl, options);
  }

  async initializeDatabase(): Promise<void> {
    initBeatmaps(this.getSequelizeSingleton());

    await this.getSequelizeSingleton().sync({ alter: true });
  }

  async closeConnection(): Promise<void> {
    await this.getSequelizeSingleton().close();
    this.sequelizeSingleton = undefined;
  }

  getSequelizeSingleton(): Sequelize {
    if (!this.sequelizeSingleton) {
      throw new Error('sequelize singleton was not initialized, use initModels() first');
    }

    return this.sequelizeSingleton;
  }

  async updateBeatmaps(beatmaps: AppBeatmap[]): Promise<void> {
    await Beatmaps.bulkCreate(beatmaps as Beatmaps[], { updateOnDuplicate: ['artist', 'title', 'creator', 'version', 'difficulty', 'AR', 'CS', 'OD', 'HP', 'BPM', 'length', 'status', 'rankedDate'] });
  }

  async getBeatmaps(options?: FindOptions<Beatmaps>): Promise<AppBeatmap[]> {
    return (await Beatmaps.findAll(options)).map(b => b.toJSON());
  }

  async getBeatmapsOfYear(year: string): Promise<AppBeatmap[]> {
    return (await Beatmaps.findAll({ where: { rankedDate: { [Op.like]: `${year}%` } } })).map(b => b.toJSON());
  }

  async getUnfinishedBeatmaps(option: 'problematic' | 'non-sd' | 'dt'): Promise<AppBeatmap[]> {
    let result: AppBeatmap[] = [];
    if (option === 'problematic') {
      result = await this.getProblematicBeatmaps();
    } else if (option === 'non-sd') {
      result = await this.getNonSDBeatmaps();
    } else {
      result = await this.getDTBeatmaps();
    }
    return result.sort((a, b) => a.difficulty > b.difficulty ? 1 : -1);
  }

  async getProblematicBeatmaps(): Promise<AppBeatmap[]> {
    return (await Beatmaps.findAll({ where: { perfect: false } })).map(b => b.toJSON());
  }

  async getNonSDBeatmaps(): Promise<AppBeatmap[]> {
    return (await Beatmaps.findAll({ where: { mods: { [Op.notLike]: '%SD%' } } })).map(b => b.toJSON());
  }

  async getDTBeatmaps(): Promise<AppBeatmap[]> {
    return (await Beatmaps.findAll({ where: { mods: { [Op.like]: '%DT%' } } })).map(b => b.toJSON());
  }

  async updateScore(score: AppScore): Promise<void> {
    const beatmap = await Beatmaps.findByPk(score.id);
    if (!beatmap) throw new Error(`beatmap ${score.id} not found in database`);

    if (!beatmap.score || beatmap.score === null) {
      await Beatmaps.update(score, { where: { id: score.id } });
      return;
    }

    if (score.score > beatmap.score) {
      await Beatmaps.update(score, { where: { id: score.id } });
    }
  }
}
