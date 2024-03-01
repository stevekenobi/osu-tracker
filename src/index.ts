import TrackerServer from './server/server';

import LeaderboardService from './server/services/LeaderboardService';
import BeatmapsService from './server/services/BeatmapsService';
import ScoresService from './server/services/ScoresService';

import dotenv from 'dotenv';
dotenv.config();

const server = new TrackerServer();

server.registerService(LeaderboardService);
server.registerService(BeatmapsService);
server.registerService(ScoresService);

function shutDownServer(): void {
  server
    .stop()
    .then(
      () => {
        console.log('Shutdown complete');
      },
      () => {
        console.log('Shutdown failed');
        process.exit(1);
      },
    )
    .then(() => process.exit(0));
}

process.on('SIGTERM', () => shutDownServer());
process.on('SIGINT', () => shutDownServer());
process.on('SIGHUP', () => shutDownServer());

server.start();
