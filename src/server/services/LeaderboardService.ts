import type { Request, Response } from 'express';
import Server from '../server';

import AbstractService from '../AbstractService';
import { updateLeaderboard } from '../helpers/leaderboard';
export default class LeaderboardService extends AbstractService {
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
    this.app.post('/api/leaderboard', this._updateCountryLeaderboard.bind(this));
  }

  private async _updateCountryLeaderboard(req: Request, res: Response): Promise<void> {
    updateLeaderboard(this.osuClient, this.databaseClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}
