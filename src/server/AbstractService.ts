import type { Express } from 'express';
import type Server from './server';

export default abstract class AbstractService {
  protected readonly app: Express;
  constructor(private serverInstance: Server) {
    this.app = this.serverInstance.getApp();
  }

  abstract registerRoutes(): void;
  abstract init(): void;
  abstract shutDown(): void;
}
