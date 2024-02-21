import AbstractService from '../AbstractService';
import { updateLeaderboard } from '../helpers/leaderboard';

export default class LeaderboardService extends AbstractService {
  constructor(serverInstance) {
    super(serverInstance);
  }

  init() {
    /* empty */
  }
  shutDown() {
    /* empty */
  }

  registerRoutes() {
    this.app.post('/api/leaderboard', this._updateCountryLeaderboardRequestHandler.bind(this));
  }

  async _updateCountryLeaderboardRequestHandler(req, res) {
    updateLeaderboard(this.osuClient, this.sheetClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}
