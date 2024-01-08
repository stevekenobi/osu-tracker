import type { Request, Response } from 'express';
import Server from '../server';
import { LeaderboardUser } from '@/types';

import AbstractService from '../AbstractService';
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
    let leaderboard: LeaderboardUser[] = [];
    const user = await this.databaseClient.getSystemUser();
    let i = 1;
    let leaderboardResponse = await this.osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
    do {
      i++;
      if (!leaderboardResponse) {
        i--;
        continue;
      }
      leaderboard = leaderboard.concat(leaderboardResponse.ranking);
      leaderboardResponse = await this.osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
    } while (leaderboardResponse?.cursor);

    leaderboard.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

    await this.databaseClient.updateSystemUser(user, leaderboard.findIndex((user) => user.user.id === parseInt(req.body['id'])) + 1);

    await this.databaseClient.updateLeaderboard(leaderboard.slice(0, 200));
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'All done',
    });
  }
}
