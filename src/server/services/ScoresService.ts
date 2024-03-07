import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import { updateAllScores } from '../helpers/scores';

export default class ScoresService extends AbstractService {
  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.post('/api/scores', (req: Request, res: Response) => {
      this._updateScoresRequestHandler(req, res);
    });
  }

  private async _updateScoresRequestHandler(_req: Request, res: Response): Promise<void> {
    updateAllScores();
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}
