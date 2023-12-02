import type { Request, Response } from 'express';
import type Server from '../server';
import AbstractService from '../AbstractService';
import { OsuClient } from '@/client';

export default class UserService extends AbstractService {
  private client: OsuClient;
  constructor(serverInstance: Server) {
    super(serverInstance);
    this.client = serverInstance.getOsuClient();
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/users/:id', this._getUserByIdRequestHandler.bind(this));
  }

  private async _getUserByIdRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.client.getUserById(parseInt(req.params['id']));
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: user,
    });
  }
}
