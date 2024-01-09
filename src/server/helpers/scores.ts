import { DatabaseClient, OsuClient } from '@/client';
import { UserScore, UserPlayedBeatmaps } from '@/types';
import { delay } from '../../utils';

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

  await databaseClient.updateUserScores(userScores);
  await databaseClient.updateUnfinishedBeatmaps(unfinished);
}
