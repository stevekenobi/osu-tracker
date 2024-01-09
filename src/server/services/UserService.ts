import type { Request, Response } from 'express';
import type Server from '../server';
import AbstractService from '../AbstractService';
import { updateLeaderboard } from '../helpers/leaderboard';
import { updateAllUserScores } from '../helpers/scores';

export default class UserService extends AbstractService {
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

    await this.databaseClient.updateSystemUserFromOsu(user);
    updateLeaderboard(this.osuClient, this.databaseClient);
    updateAllUserScores(this.osuClient, this.databaseClient);

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: user,
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
