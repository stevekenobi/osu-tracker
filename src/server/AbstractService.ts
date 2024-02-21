import type TrackerServer from './server';

export default class AbstractService {
  readonly app;

  readonly sheetClient;
  readonly databaseClient;
  readonly osuClient;

  constructor(private readonly serverInstance: TrackerServer) {
    this.serverInstance = serverInstance;
    this.app = this.serverInstance.getApp();

    this.sheetClient = this.serverInstance.getSheetClient();
    this.databaseClient = this.serverInstance.getDatabaseClient();
    this.osuClient = this.serverInstance.getOsuClient();
  }

  registerRoutes() {
    throw new Error('overwrite registerRoutes()');
  }

  init() {
    throw new Error('overwrite init()');
  }

  shutDown() {
    throw new Error('overwrite shutDown()');
  }
}
