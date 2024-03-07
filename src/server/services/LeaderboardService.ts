import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import { updateLeaderboard } from '../helpers/leaderboard';

export default class LeaderboardService extends AbstractService {
  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.post('/api/leaderboard', (req: Request, res: Response) => {
      this._updateCountryLeaderboardRequestHandler(req, res);
    });
  }

  private async _updateCountryLeaderboardRequestHandler(_req: Request, res: Response): Promise<void> {
    updateLeaderboard();
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}
