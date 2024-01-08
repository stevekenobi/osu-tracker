import Server from './server';
import BeatmapsService from './services/BeatmapsService';
import UserService from './services/UserService';
import ScoresService from './services/ScoresService';
import LeaderboardService from './services/LeaderboardService';

export const server = new Server();

server.registerService(BeatmapsService);
server.registerService(UserService);
server.registerService(ScoresService);
server.registerService(LeaderboardService);

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
