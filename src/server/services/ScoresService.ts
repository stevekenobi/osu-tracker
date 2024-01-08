import type { Request, Response } from 'express';
import { UserScore, UserPlayedBeatmaps } from '@/types';
import { delay } from '../../utils';
import AbstractService from '../AbstractService';
import Server from '../server';

export default class ScoresService extends AbstractService {
  constructor(serverInstance: Server) {
    super(serverInstance);
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.post('/api/scores', this._updateAllScoresRequestHandler.bind(this));
  }

  private async _updateAllScoresRequestHandler(req: Request, res: Response): Promise<void> {
    const userScores: UserScore[] = [];
    const unfinished: UserPlayedBeatmaps[] = [];
    const user = await this.databaseClient.getSystemUser();
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
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'All done',
    });
  }
}
