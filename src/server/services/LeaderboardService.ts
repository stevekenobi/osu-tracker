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
    this.app.get('/api/leaderboard', this._getCountryLeaderboardRequestHandler.bind(this));
    this.app.post('/api/leaderboard', this._updateCountryLeaderboardRequestHandler.bind(this));
  }

  private async _getCountryLeaderboardRequestHandler(req: Request, res: Response): Promise<void> {
    const result = await this.databaseClient.getLeaderboard();

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: result,
    });
  }

  private async _updateCountryLeaderboardRequestHandler(req: Request, res: Response): Promise<void> {
    updateLeaderboard(this.osuClient, this.databaseClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}
