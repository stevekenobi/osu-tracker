'use strict';

class AbstractService {

  constructor(serverInstance) {
    this.serverInstance = serverInstance;
    this.app = this.serverInstance.getApp();

    this.sheetClient = this.serverInstance.getSheetClient();
    this.osuClient = this.serverInstance.getOsuClient();
  }

  /**
   * @abstract
   * @returns {void}
   */
  registerRoutes() {
    throw new Error('overwrite registerRoutes()')
  }
  /**
   * @abstract
   * @returns {void}
   */
  init() {
    throw new Error('overwrite init()')
  }
  /**
   * @abstract
   * @returns {void}
   */
  shutDown() {
    throw new Error('overwrite shutDown()')
  }
}

module.exports = AbstractService;
