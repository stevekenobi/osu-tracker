import type { Application, Router } from 'express';
import express from 'express';
import type { Server } from 'http';
import http from 'http';

import OsuClient from '../client/OsuClient';
import SheetClient from '../client/SheetClient';
import DatabaseClient from '../client/DatabaseClient';

import { updateLeaderboard, updateTargets } from './helpers/leaderboard';

import cron from 'node-cron';
import type AbstractService from './AbstractService';
import { importNewScoresJob } from './helpers/cronJobs';

type IAbstractService = new (server: TrackerServer) => AbstractService;

export default class TrackerServer {
  private services: AbstractService[] = [];

  private app: Application | null = null;
  private router: Router | null = null;
  private server: Server | null = null;

  static databaseClient: DatabaseClient | null = null;
  static osuClient: OsuClient | null = null;
  static sheetClient: SheetClient | null = null;

  constructor() {
    this.services = [];
    this._initClients();
    this._initExpress();
  }

  registerService(service: IAbstractService): void {
    this.services.push(new service(this));
  }

  _initExpress(): void {
    this.app = express();
    this.router = express.Router();
    this.app.use(express.json());
  }

  start(): void {
    this._initServices();

    cron.schedule('0,30 * * * *', () => {
      updateLeaderboard();
    });

    cron.schedule('0 * * * *', () => {
      importNewScoresJob();
    });

    cron.schedule('0 0 * * *', () => {
      updateTargets();
    });

    if (process.env['ENVIRONMENT'] === 'development') {
      setInterval(() => {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        if (used > 300) {
          console.log(`This app is currently using ${Math.floor(used)} MB of memory.`);
        }
      }, 5000);
    }

    this.server = http.createServer(this.getApp()).listen('5173', () => {
      console.log('⚡️[server]: Server is running at http://localhost:5173');
    });
  }

  stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('Received kill signall, trying to shutdown server gracefully');
      const timeoutRef = setTimeout(() => {
        console.log('Shutdown timeout reached');
        reject(new Error('Shutdown timeout reached'));
      }, 5000);

      this.getServer().close((err) => {
        if (err) {
          console.log(err.message);
          reject(err);
        }

        this._shutDownServices();

        console.log('Closed out all connections. Server shutdown successful');
        clearTimeout(timeoutRef);
        resolve('ok');
      });
    });
  }

  _initClients(): void {
    TrackerServer.osuClient = new OsuClient({
      client_id: process.env['CLIENT_ID'] ?? '',
      client_secret: process.env['CLIENT_SECRET'] ?? '',
    });

    TrackerServer.databaseClient = new DatabaseClient(process.env['DATABASE_URL'] ?? '', process.env['DATABASE_SECURE'] ?? '');
    TrackerServer.getDatabaseClient().initializeDatabase();

    TrackerServer.sheetClient = new SheetClient(
      process.env['LEADERBOARD_SHEET_ID'] ?? '',
      process.env['UNFINISHED_SHEET_ID'] ?? '',
      process.env['BEATMAPS_SHEET_ID'] ?? '',
      process.env['AGES_SHEET_ID'] ?? '',
    );
  }

  _initServices(): void {
    this.services.forEach((service: AbstractService) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      console.log(`initializing ${(service as any).constructor.name}`);
      service.init();
      service.registerRoutes();
    });
  }

  _shutDownServices(): void {
    this.services.forEach((service: AbstractService) => {
      console.log(`shuting down ${typeof service}`);
      service.shutDown();
    });

    TrackerServer.getDatabaseClient()
      .closeConnection()
      .then(
        () => {
          console.log('closed database connection');
        },
        () => {
          console.log('error closing database connection');
        },
      );
  }

  getServer(): Server {
    if (!this.server) {
      throw new Error('Server was not initialized correctly');
    }
    return this.server;
  }

  getRouter(): Router {
    if (!this.router) {
      throw new Error('Router was not initialized correctly');
    }
    return this.router;
  }

  getApp(): Application {
    if (!this.app) {
      throw new Error('App was not initialized correctly');
    }
    return this.app;
  }

  static getOsuClient(): OsuClient {
    if (!TrackerServer.osuClient) {
      throw new Error('osu client was not initialized correctly');
    }
    return TrackerServer.osuClient;
  }

  static getDatabaseClient(): DatabaseClient {
    if (!TrackerServer.databaseClient) {
      throw new Error('database client was not initialized correctly');
    }
    return TrackerServer.databaseClient;
  }

  static getSheetClient(): SheetClient {
    if (!TrackerServer.sheetClient) {
      throw new Error('sheet client was not initialized correctly');
    }
    return TrackerServer.sheetClient;
  }
}
