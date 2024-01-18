import type { Express, Router } from 'express';
import type { Server as HttpServer } from 'http';
import cors from 'cors';
import express from 'express';
import http from 'http';

import type AbstractService from './AbstractService';
import { DatabaseClient, OsuClient } from '../client';

import { importLatestBeatmaps } from './helpers/beatmaps';
import { updateLeaderboard } from './helpers/leaderboard';
import { updateRecentScores } from './helpers/scores';

export default class Server {
  private server: HttpServer | undefined = undefined;
  private app: Express | undefined = undefined;
  private router: Router | undefined = undefined;
  private osuClient: OsuClient | undefined = undefined;
  private databaseClient: DatabaseClient | undefined = undefined;
  private services: AbstractService[] = [];

  constructor() {
    this._initClients();
    this._initExpress();
  }

  public registerService(service: Class<AbstractService>): void {
    this.services.push(new service(this));
  }

  private _initExpress(): void {
    this.app = express();
    this.router = express.Router();
    this.app.use(cors());
    this.app.use(express.json());
  }

  public start(): void {
    this._initServices();

    importLatestBeatmaps(this.getDatabaseClient(), this.getOsuClient());
    updateLeaderboard(this.getOsuClient(), this.getDatabaseClient());
    updateRecentScores(this.getDatabaseClient());

    setInterval(() => {
      importLatestBeatmaps(this.getDatabaseClient(), this.getOsuClient());
      updateLeaderboard(this.getOsuClient(), this.getDatabaseClient());
      updateRecentScores(this.getDatabaseClient());
    }, 3600 * 1000);

    this.server = http.createServer(this.getApp()).listen('5173', () => {
      console.log(`⚡️[server]: Server is running at http://localhost:5173`);
    });
  }

  public stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('Received kill signall, trying to shutdown server gracefully');
      const timeoutRef = setTimeout(() => {
        console.log('Shutdown timeout reached');
        reject('Shutdown timeout reached');
      }, 5000);

      this.getServer().close((err) => {
        if (err) {
          console.log(err.message);
          clearTimeout(timeoutRef);
          reject(err);
        }

        this._shutDownServices();

        console.log('Closed out all connections. Server shutdown successful');
        clearTimeout(timeoutRef);
        resolve('ok');
      });
    });
  }

  private _initClients(): void {
    this.databaseClient = new DatabaseClient();
    this.databaseClient.init();

    this.osuClient = new OsuClient({
      clientId: 27949,
      clientSecret: 'tPp9TKXZCa2AU8e5uQp8vOK2caWqrmqIamQ8544B',
    });
  }

  private _initServices(): void {
    this.services.forEach((service: AbstractService) => {
      console.log(`initializing ${typeof service}`);
      service.init();
      service.registerRoutes();
    });
  }

  private _shutDownServices(): void {
    this.services.forEach((service) => {
      console.log(`shuting down ${typeof service}`);
      service.shutDown();
    });
  }

  public getServer(): HttpServer {
    if (!this.server) {
      throw new Error('Server was not initialized correctly');
    }
    return this.server;
  }

  public getRouter(): Router {
    if (!this.router) {
      throw new Error('Router was not initialized correctly');
    }
    return this.router;
  }

  public getApp(): Express {
    if (!this.app) {
      throw new Error('App was not initialized correctly');
    }
    return this.app;
  }

  public getDatabaseClient(): DatabaseClient {
    if (!this.databaseClient) {
      throw new Error('Database client was not initialized correctly');
    }
    return this.databaseClient;
  }

  public getOsuClient(): OsuClient {
    if (!this.osuClient) {
      throw new Error('osu client was not initialized correctly');
    }
    return this.osuClient;
  }
}

type Class<T extends AbstractService> = new (arg: Server) => T;
