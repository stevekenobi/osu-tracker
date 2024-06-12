import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import { getOsuBeatmapPacks } from '../helpers/packs';

export default class PackService extends AbstractService {
  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/packs/downloads', (req: Request, res: Response) => {
      this._getAllDownloadLinks(req, res);
    });
  }

  private async _getAllDownloadLinks(_req: Request, res: Response): Promise<void> {
    const data = await getOsuBeatmapPacks();

    res.status(200).json({
      data,
      meta: {
        status: 200,
      },
    });
  }
}
