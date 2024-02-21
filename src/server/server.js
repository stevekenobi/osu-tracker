'use strict';

const cors = require('cors');
const express = require('express');
const http = require('http');

const OsuClient = require('../client/OsuClient');
const SheetClient = require('../client/SheetClient');
const DatabaseClient = require('../client/DatabaseClient');

const { updateLeaderboard } = require('./helpers/leaderboard');
const { importLatestBeatmaps, syncBeatmapsSheet } = require('./helpers/beatmaps');

const cron = require('node-cron');
const { updateScores } = require('./helpers/scores');

class TrackerServer {
  constructor() {
    this.services = [];
    this._initClients();
    this._initExpress();
  }

  registerService(service) {
    this.services.push(new service(this));
  }

  _initExpress() {
    this.app = express();
    this.router = express.Router();
    this.app.use(cors());
    this.app.use(express.json());
  }

  start() {
    this._initServices();

    if (process.env.ENVIRONMENT === 'production') {
      cron.schedule('0,30 * * * *', () => {
        updateLeaderboard(this.getOsuClient(), this.getSheetClient());
      });

      cron.schedule('0,30 * * * *', async () => {
        await importLatestBeatmaps(this.getOsuClient(), this.getDatabaseClient());
        await syncBeatmapsSheet(this.getDatabaseClient(), this.getSheetClient());
      });

      cron.schedule('0 */2 * * *', async () => {
        await importLatestBeatmaps(this.getOsuClient(), this.getDatabaseClient());
        await updateScores(this.getOsuClient(), this.getDatabaseClient(), this.getSheetClient());
        await syncBeatmapsSheet(this.getDatabaseClient(), this.getSheetClient());
      });
    } else if (process.env.ENVIRONMENT === 'dev')
      setInterval(() => {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`This app is currently using ${Math.floor(used)} MB of memory.`);
      }, 5000);

    this.server = http.createServer(this.getApp()).listen('5173', () => {
      console.log('⚡️[server]: Server is running at http://localhost:5173');
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      console.log('Received kill signall, trying to shutdown server gracefully');
      const timeoutRef = setTimeout(() => {
        console.log('Shutdown timeout reached');
        reject('Shutdown timeout reached');
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

  _initClients() {
    this.osuClient = new OsuClient({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    this.databaseClient = new DatabaseClient(process.env.DATABASE_URL, process.env.DATABASE_SECURE);
    this.getDatabaseClient().initializeDatabase();

    this.sheetClient = new SheetClient(process.env.LEADERBOARD_SHEET_ID, process.env.UNFINISHED_SHEET_ID, process.env.BEATMAPS_SHEET_ID);
  }

  _initServices() {
    this.services.forEach((service) => {
      console.log(`initializing ${typeof service}`);
      service.init();
      service.registerRoutes();
    });
  }

  _shutDownServices() {
    this.services.forEach((service) => {
      console.log(`shuting down ${typeof service}`);
      service.shutDown();
    });

    this.getDatabaseClient()
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

  getServer() {
    if (!this.server) {
      throw new Error('Server was not initialized correctly');
    }
    return this.server;
  }

  getRouter() {
    if (!this.router) {
      throw new Error('Router was not initialized correctly');
    }
    return this.router;
  }

  getApp() {
    if (!this.app) {
      throw new Error('App was not initialized correctly');
    }
    return this.app;
  }

  getOsuClient() {
    if (!this.osuClient) {
      throw new Error('osu client was not initialized correctly');
    }
    return this.osuClient;
  }

  getDatabaseClient() {
    if (!this.databaseClient) {
      throw new Error('database client was not initialized correctly');
    }
    return this.databaseClient;
  }

  getSheetClient() {
    if (!this.sheetClient) {
      throw new Error('sheet client was not initialized correctly');
    }
    return this.sheetClient;
  }
}

module.exports = TrackerServer;
