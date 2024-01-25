import type { Request, Response } from 'express';

import AbstractService from '../AbstractService';
import Server from '../server';
import { createAppBeatmapsetFromAppBeatmaps, updateBeatmaps } from '../helpers/beatmaps';
import { Beatmaps } from '../../client';
import { Op } from 'sequelize';

export default class BeatmapsService extends AbstractService {
  constructor(serverInstance: Server) {
    super(serverInstance);
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/beatmaps', this._getBeatmapListRequestHandler.bind(this));
    this.app.get('/api/beatmaps/sets/:year', this._getYearBeatmapsetsRequestHandler.bind(this));
    this.app.post('/api/beatmaps', this._postBeatmapUpdateRequestHandler.bind(this));
    this.app.get('/api/beatmaps/unfinished', this._getUnfinishedBeatmapsRequestHandler.bind(this));
  }

  private async _getBeatmapListRequestHandler(req: Request, res: Response): Promise<void> {
    const beatmaps = await Beatmaps.findAll();
    const response = createAppBeatmapsetFromAppBeatmaps(beatmaps);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _getYearBeatmapsetsRequestHandler(req: Request, res: Response) {
    const beatmaps = await Beatmaps.findAll({ where: { ranked_date: { [Op.like]: `${req.params.year}%` } }, include: 'score' });
    const response = createAppBeatmapsetFromAppBeatmaps(beatmaps);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _postBeatmapUpdateRequestHandler(req: Request, res: Response): Promise<void> {
    updateBeatmaps(this.databaseClient, this.osuClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _getUnfinishedBeatmapsRequestHandler(req: Request, res: Response): Promise<void> {
    const result = await this.databaseClient.getUnfinishedBeatmaps();

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: result,
    });
  }
}
