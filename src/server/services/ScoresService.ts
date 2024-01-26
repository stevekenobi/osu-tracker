import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import Server from '../server';
import { updateAllUserScores } from '../helpers/scores';
import { Scores } from '../../client';

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
    this.app.get('/api/scores/:year', this._getUserScoresRequestHandler.bind(this));
  }

  private async _updateAllScoresRequestHandler(req: Request, res: Response): Promise<void> {
    await updateAllUserScores(this.osuClient, this.databaseClient);

    console.log('finished scores and unfinished');
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'All done',
    });
  }

  private async _getUserScoresRequestHandler(req: Request, res: Response): Promise<void> {
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
