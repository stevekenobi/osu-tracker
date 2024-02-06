import type { Request, Response } from 'express';

import AbstractService from '../AbstractService';
import Server from '../server';
import { createAppBeatmapsetFromAppBeatmaps, updateBeatmaps, updateUnfinishedBeatmaps } from '../helpers/beatmaps';

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
    this.app.post('/api/beatmaps/unfinished', this._postUnfinishedBeatmapsRequestHandler.bind(this));
  }

  private async _getBeatmapListRequestHandler(req: Request, res: Response): Promise<void> {
    const beatmaps = await this.sheetClient.readBeatmaps('2007');
    const response = createAppBeatmapsetFromAppBeatmaps(beatmaps);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _getYearBeatmapsetsRequestHandler(req: Request, res: Response) {
    const beatmaps = await this.sheetClient.readBeatmaps(req.params.year);
    const response = createAppBeatmapsetFromAppBeatmaps(beatmaps);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _postBeatmapUpdateRequestHandler(req: Request, res: Response): Promise<void> {
    updateBeatmaps(this.sheetClient, this.osuClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _postUnfinishedBeatmapsRequestHandler(req: Request, res: Response): Promise<void> {
    updateUnfinishedBeatmaps(this.sheetClient, this.osuClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _getUnfinishedBeatmapsRequestHandler(req: Request, res: Response): Promise<void> {
    const result = await this.sheetClient.readUnfinishedBeatmaps();

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: result,
    });
  }
}
