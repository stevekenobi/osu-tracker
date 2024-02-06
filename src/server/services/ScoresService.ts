import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import Server from '../server';
import { updateAllUserScores } from '../helpers/scores';
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
    this.app.post('/api/scores/:year', this._updateAllScoresRequestHandler.bind(this));
  }

  private async _updateAllScoresRequestHandler(req: Request, res: Response): Promise<void> {
    try {
      updateAllUserScores(this.osuClient, this.sheetClient, req.params.year);

      res.status(200).json({
        meta: {
          status: 200,
        },
        data: 'Job Started',
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
}
