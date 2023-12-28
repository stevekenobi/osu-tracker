import type { Request, Response } from 'express';
import type Server from '../server';
import AbstractService from '../AbstractService';
import { DatabaseClient, OsuClient } from '@/client';
import { LeaderboardUser } from '@/types';

export default class UserService extends AbstractService {
  private databaseClient: DatabaseClient;
  private osuClient: OsuClient;

  constructor(serverInstance: Server) {
    super(serverInstance);

    this.databaseClient = serverInstance.getDatabaseClient();
    this.osuClient = serverInstance.getOsuClient();
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/user', this._getSystemUserRequestHandler.bind(this));
    this.app.post('/api/user', this._addSystemUserRequestHandler.bind(this));
    this.app.get('/api/users/:id', this._getUserByIdRequestHandler.bind(this));
  }

  private async _getSystemUserRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.databaseClient.getSystemUser();
    if (user === undefined) {
      res.status(200).json({
        meta: {
          status: 404,
        },
      });

      return;
    }
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: user,
    });
  }

  private async _addSystemUserRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.osuClient.getUserById(parseInt(req.body['id']));
    if (!user) {
      res.status(404).json({
        meta: {
          status: 404,
        },
      });
      return;
    }

    let result: LeaderboardUser[] = [];
    let i = 1;
    let leaderboard = await this.osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
    do {
      i++;
      console.log(leaderboard?.ranking.map((x) => x.user.username));
      if (!leaderboard) {
        i--;
        continue;
      }
      result = result.concat(leaderboard.ranking);
      leaderboard = await this.osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
    } while (leaderboard?.cursor);

    result.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

    const createdUser = await this.databaseClient.updateSystemUser(user, result.findIndex((user) => user.user.id === parseInt(req.body['id'])) + 1);

    await this.databaseClient.updateLeaderboard(result.slice(0, 200));

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: createdUser,
    });

  }

  private async _getUserByIdRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.osuClient.getUserById(parseInt(req.params['id']));
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: user,
    });
  }
}
