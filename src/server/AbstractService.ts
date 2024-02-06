import type { Express } from 'express';
import type Server from './server';
import { OsuClient, SheetClient } from '../client';

export default abstract class AbstractService {
  protected readonly app: Express;
  protected readonly sheetClient: SheetClient;
  protected readonly osuClient: OsuClient;

  constructor(private serverInstance: Server) {
    this.app = this.serverInstance.getApp();

    this.sheetClient = this.serverInstance.getSheetClient();
    this.osuClient = this.serverInstance.getOsuClient();
  }

  abstract registerRoutes(): void;
  abstract init(): void;
  abstract shutDown(): void;
}
