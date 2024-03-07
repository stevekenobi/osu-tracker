import type TrackerServer from './server';

export default class AbstractService {
  readonly app;

  constructor(private readonly serverInstance: TrackerServer) {
    this.serverInstance = serverInstance;
    this.app = this.serverInstance.getApp();
  }

  registerRoutes(): void {
    throw new Error('overwrite registerRoutes()');
  }

  init(): void {
    throw new Error('overwrite init()');
  }

  shutDown(): void {
    throw new Error('overwrite shutDown()');
  }
}
