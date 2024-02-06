import type { Request, Response } from 'express';
import type Server from '../server';
import AbstractService from '../AbstractService';
import { updateLeaderboard } from '../helpers/leaderboard';
import { updateUnfinishedBeatmaps } from '../helpers/beatmaps';

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
    this.app.post('/api/user', this._addSystemUserRequestHandler.bind(this));
    this.app.get('/api/users/:id', this._getUserByIdRequestHandler.bind(this));
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

    updateLeaderboard(this.osuClient, this.sheetClient);
    updateUnfinishedBeatmaps(this.sheetClient, this.osuClient);

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
