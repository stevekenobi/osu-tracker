import type { Request, Response } from 'express';
import type Server from '../server';
import AbstractService from '../AbstractService';
import { DatabaseClient, OsuClient } from '@/client';
import { LeaderboardUser, UserPlayedBeatmaps, UserScore } from '@/types';
import { delay } from '../../utils';

export default class UserService extends AbstractService {
  private databaseClient: DatabaseClient;
  private osuClient: OsuClient;

  constructor(serverInstance: Server) {
    super(serverInstance);

    this.databaseClient = serverInstance.getDatabaseClient();
    this.osuClient = serverInstance.getOsuClient();
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/user', this._getSystemUserRequestHandler.bind(this));
    this.app.post('/api/user', this._addSystemUserRequestHandler.bind(this));
    this.app.get('/api/users/:id', this._getUserByIdRequestHandler.bind(this));
  }

  private async _getSystemUserRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.databaseClient.getSystemUser();
    if (user === undefined) {
      res.status(200).json({
        meta: {
          status: 404,
        },
      });

      return;
    }
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: user,
    });
  }

  private async _addSystemUserRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.osuClient.getUserById(parseInt(req.body['id']));
    if (!user) {
      res.status(404).json({
        meta: {
          status: 404,
        },
      });
      return;
    }

    // create unfinished beatmaps
    const userScores: UserScore[] = [];
    const unfinished: UserPlayedBeatmaps[] = [];
    let j = 0;
    let playedResponse = await this.osuClient.getUserBeamaps(user.id, 'most_played', { limit: '100', offset: j.toString() });
    do {
      j += 100;
      if (!playedResponse) {
        j -= 100;
        continue;
      }

      playedResponse
        .filter((b) => b.beatmap.mode === 'osu' && (b.beatmap.status === 'ranked' || b.beatmap.status === 'approved' || b.beatmap.status === 'loved'))
        .forEach(async (b) => {
          const score = await this.osuClient.getUserScoreOnBeatmap(b.beatmap_id, user.id);
          console.log(`${j}: Score on ${b.beatmap_id} ${score ? 'found' : 'not found'}`);
          if (score) {
            userScores.push(score);
          } else {
            unfinished.push(b);
          }
        });

      await delay(5000);

      playedResponse = await this.osuClient.getUserBeamaps(user.id, 'most_played', { limit: '100', offset: j.toString() });
    } while (playedResponse?.length !== 0);

    await this.databaseClient.updateUserScores(userScores);
    await this.databaseClient.updateUnfinishedBeatmaps(unfinished);
    console.log('finished scores and unfinished');

    // create leaderboard
    let leaderboard: LeaderboardUser[] = [];
    let i = 1;
    let leaderboardResponse = await this.osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
    do {
      i++;
      if (!leaderboardResponse) {
        i--;
        continue;
      }
      leaderboard = leaderboard.concat(leaderboardResponse.ranking);
      leaderboardResponse = await this.osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
    } while (leaderboardResponse?.cursor);

    leaderboard.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

    const createdUser = await this.databaseClient.updateSystemUser(user, leaderboard.findIndex((user) => user.user.id === parseInt(req.body['id'])) + 1);

    await this.databaseClient.updateLeaderboard(leaderboard.slice(0, 200));

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: createdUser,
    });
  }

  private async _getUserByIdRequestHandler(req: Request, res: Response): Promise<void> {
    const user = await this.osuClient.getUserById(parseInt(req.params['id']));
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: user,
    });
  }
}
