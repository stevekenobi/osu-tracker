import { initLeaderboard } from './models/LeaderboardModel';
import { initUser } from './models/UserModel';
import { getSequelizeSingleton, initModels } from './models/initialize';

export class DatabaseClient {
  constructor() {}

  public async init() {
    console.log('Initializing Database');

    await initModels();

    initUser(getSequelizeSingleton());
    initLeaderboard(getSequelizeSingleton());

    // options: {force: true} -> drop and recreate
    // options: {alter: true} -> amend tables
    await getSequelizeSingleton().sync();
  }
}
