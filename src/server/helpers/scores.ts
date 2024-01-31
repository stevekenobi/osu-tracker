import { Beatmaps, DatabaseClient, OsuClient } from '../../client';
import { UserScore, UserPlayedBeatmaps } from '@/types';
import { delay } from '../../utils';
import { createAppBeatmapsFromBeatmapset } from './beatmaps';

export async function updateRecentScores(databaseClient: DatabaseClient) {
  const user = await databaseClient.getSystemUser();

  if (!user) return;
}

export async function updateAllUserScores(osuClient: OsuClient, databaseClient: DatabaseClient) {
  const userScores: UserScore[] = [];
  const unfinished: UserPlayedBeatmaps[] = [];
  const user = await databaseClient.getSystemUser();
  let j = 0;
  let playedResponse = await osuClient.getUserBeamaps(user.id, 'most_played', { limit: '100', offset: j.toString() });
  do {
    j += 100;
    if (!playedResponse) {
      j -= 100;
      continue;
    }

    playedResponse
      .filter((b) => b.beatmap.mode === 'osu' && (b.beatmap.status === 'ranked' || b.beatmap.status === 'approved' || b.beatmap.status === 'loved'))
      .forEach(async (b) => {
        const score = await osuClient.getUserScoreOnBeatmap(b.beatmap_id, user.id);
        const beatmap = await databaseClient.findBeatmapById(b.beatmap_id);
        if (!beatmap) {
          const beatmapsetFromOsu = await osuClient.getBeatmapsetById(b.beatmapset.id);

          if (!beatmapsetFromOsu) {
            console.log(`Could not find beatmapset ${b.beatmapset.id}`);
            return;
          }
          await databaseClient.updateBeatmaps(createAppBeatmapsFromBeatmapset(beatmapsetFromOsu));
        }
        console.log(`${j}: Score on ${b.beatmap_id} ${score ? 'found' : 'not found'}`);
        if (score) {
          userScores.push(score);
        } else {
          unfinished.push(b);
        }
      });

    await delay(5000);

    playedResponse = await osuClient.getUserBeamaps(user.id, 'most_played', { limit: '100', offset: j.toString() });
  } while (playedResponse?.length !== 0);

  await databaseClient.updateUserScores(userScores, user.id);
  await databaseClient.updateUnfinishedBeatmaps(user.id, unfinished);
}

export async function getScoresOfUser(osuClient: OsuClient, id: string) {
  const beatmaps = await Beatmaps.findAll();
  const scores = [];

  for (const b of beatmaps) {
    const score = await osuClient.getUserScoreOnBeatmap(b.id, id);

    if (score) scores.push(score);
    console.log(`Score on ${b.id} ${score ? 'found' : 'not found'}`);
  }

  return scores;
}
