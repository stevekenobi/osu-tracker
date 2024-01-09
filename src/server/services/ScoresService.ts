import type { Request, Response } from 'express';
import AbstractService from '../AbstractService';
import Server from '../server';
import { updateAllUserScores } from '../helpers/scores';

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
  }

  private async _updateAllScoresRequestHandler(req: Request, res: Response): Promise<void> {
    updateAllUserScores(this.osuClient, this.databaseClient);

    console.log('finished scores and unfinished');
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'All done',
    });
  }
}
