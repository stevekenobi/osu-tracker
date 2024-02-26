import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import { importAllBeatmaps, importLatestBeatmaps, findMissingBeatmaps } from '../helpers/beatmaps';
import type TrackerServer from '../server';

export default class BeatmapsService extends AbstractService {
  constructor(serverInstance: TrackerServer) {
    super(serverInstance);
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.post('/api/beatmaps', this._importAllBeatmapsRequestHandler.bind(this));
    this.app.post('/api/beatmaps/missing', this._findAllMissingBeatmapsRequestHandler.bind(this));
    this.app.post('/api/beatmaps/recent', this._updateRecentBeatmapsRequestHandler.bind(this));
  }

  private async _importAllBeatmapsRequestHandler(_req: Request, res: Response) : Promise<void>{
    importAllBeatmaps(this.osuClient, this.databaseClient, this.sheetClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _findAllMissingBeatmapsRequestHandler(req: Request<unknown, unknown, {userId: number}>, res: Response) : Promise<void>{
    findMissingBeatmaps(this.osuClient, this.databaseClient, this.sheetClient, req.body.userId);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _updateRecentBeatmapsRequestHandler(_req: Request, res: Response) : Promise<void>{
    await importLatestBeatmaps(this.osuClient, this.databaseClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job finished',
    });
  }
}

module.exports = BeatmapsService;