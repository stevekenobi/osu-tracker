const AbstractService = require('../AbstractService');
const { importAllBeatmaps, importLatestBeatmaps } = require('../helpers/beatmaps');

class BeatmapsService extends AbstractService {
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
    this.app.post('/api/beatmaps', this._importAllBeatmapsRequestHandler.bind(this));
    this.app.post('/api/beatmaps/recent', this._updateRecentBeatmapsRequestHandler.bind(this));
  }

  /**
   * @private
   * @param {Request} req
   * @param {Response} res
   */
  async _importAllBeatmapsRequestHandler(req, res) {
    importAllBeatmaps(this.osuClient, this.databaseClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  /**
   * @private
   * @param {Request} req
   * @param {Response} res
   */
  async _updateRecentBeatmapsRequestHandler(req, res) {
    await importLatestBeatmaps(this.osuClient, this.databaseClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job finished',
    });
  }
}

module.exports = BeatmapsService;
