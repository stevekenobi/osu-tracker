import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import { updateLeaderboard } from '../helpers/leaderboard';
import type TrackerServer from '../server';

export default class LeaderboardService extends AbstractService {
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
    this.app.post('/api/leaderboard', this._updateCountryLeaderboardRequestHandler.bind(this));
  }

  private async _updateCountryLeaderboardRequestHandler(_req: Request, res: Response): Promise<void> {
    updateLeaderboard(this.osuClient, this.sheetClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}
