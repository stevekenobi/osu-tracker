import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import { importAllBeatmaps, importLatestBeatmaps, addMissingBeatmaps } from '../helpers/beatmaps';

export default class BeatmapsService extends AbstractService {

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.post('/api/beatmaps', (req: Request, res: Response) => {
      this._importAllBeatmapsRequestHandler(req, res);
    });
    this.app.post('/api/beatmaps/missing', (req: Request, res: Response) => {
      this._findAllMissingBeatmapsRequestHandler(req, res);
    });
    this.app.post('/api/beatmaps/recent', (req: Request, res: Response) => {
      this._updateRecentBeatmapsRequestHandler(req, res);
    });
  }

  private async _importAllBeatmapsRequestHandler(_req: Request, res: Response): Promise<void> {
    importAllBeatmaps();
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _findAllMissingBeatmapsRequestHandler(req: Request<unknown, unknown, { userId: number }>, res: Response): Promise<void> {
    addMissingBeatmaps(req.body.userId);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _updateRecentBeatmapsRequestHandler(_req: Request, res: Response): Promise<void> {
    await importLatestBeatmaps();
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job finished',
    });
  }
}

module.exports = BeatmapsService;
