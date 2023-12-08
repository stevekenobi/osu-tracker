import type { Request, Response } from 'express';
import type Server from '../server';
import AbstractService from '../AbstractService';
import { DatabaseClient, OsuClient } from '@/client';

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
    if (user) {
      const createdUser = await this.databaseClient.updateSystemUser(user);
      res.status(200).json({
        meta: {
          status: 200,
        },
        data: createdUser,
      });

      return;
    }
    res.status(404).json({
      meta: {
        status: 404,
      },
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
