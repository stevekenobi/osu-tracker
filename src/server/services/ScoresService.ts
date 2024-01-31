import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import Server from '../server';
import { getScoresOfUser, updateAllUserScores } from '../helpers/scores';
import { Scores } from '../../client';
import { AxiosError } from 'axios';

export default class ScoresService extends AbstractService {
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
    this.app.post('/api/scores', this._updateAllScoresRequestHandler.bind(this));
    this.app.get('/api/scores/:year', this._getSystemUserScoresRequestHandler.bind(this));
    this.app.get('/api/scores/user/:id', this._getUserScoresRequestHandler.bind(this));
  }

  private async _updateAllScoresRequestHandler(req: Request, res: Response): Promise<void> {
    try {
      await updateAllUserScores(this.osuClient, this.databaseClient);

      res.status(200).json({
        meta: {
          status: 200,
        },
        data: 'All done',
      });
    } catch (err: unknown) {
      const error = err as AxiosError;
      res.status(error.status ?? 404).json({
        meta: {
          status: error.status ?? 404,
        },
        data: error.toJSON(),
      });
    }
  }

  private async _getUserScoresRequestHandler(req: Request, res: Response): Promise<void> {
    const response = await getScoresOfUser(this.osuClient, req.params.id);

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _getSystemUserScoresRequestHandler(req: Request, res: Response): Promise<void> {
    const response = await Scores.findAll();

    if (response.length > 0) {
      res.status(200).json({
        meta: {
          status: 200,
        },
        data: response,
      });
      return;
    }
    res.status(404).json({
      meta: {
        status: 404,
      },
    });
  }
}
