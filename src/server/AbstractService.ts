import type { Express } from 'express';
import type Server from './server';
import { DatabaseClient, OsuClient } from '../client';

export default abstract class AbstractService {
  protected readonly app: Express;
  protected readonly databaseClient: DatabaseClient;
  protected readonly osuClient: OsuClient;

  constructor(private serverInstance: Server) {
    this.app = this.serverInstance.getApp();

    this.databaseClient = this.serverInstance.getDatabaseClient();
    this.osuClient = this.serverInstance.getOsuClient();
  }

  abstract registerRoutes(): void;
  abstract init(): void;
  abstract shutDown(): void;
}
