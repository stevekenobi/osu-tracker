import { DatabaseClient, OsuClient, SheetClient } from '@/client';
import { UserScore, UserPlayedBeatmaps, AppBeatmapScore, AppBeatmap, AppBeatmapsetScore } from '@/types';
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

export async function getUserScores(databaseClient: DatabaseClient, sheetClient: SheetClient, year: string): Promise<AppBeatmapsetScore[]> {
  const result: AppBeatmapScore[] = [];
  const beatmaps = await sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year);
  for (const b of beatmaps) {
    const score = await databaseClient.findScoreOnBeatmap(parseInt((b.Link ?? '').split('/')[4]));

    if (score) {
      result.push({
        beatmap: b as AppBeatmap,
        score: {
          accuracy: score.accuracy,
          created_at: score.created_at,
          id: score.id,
          max_combo: score.max_combo,
          mode: score.mode,
          mods: score.mods,
          perfect: score.perfect,
          pp: score.pp,
          rank: score.rank,
          score: score.score,
          count_100: score.count_100,
          count_300: score.count_300,
          count_50: score.count_50,
          count_geki: score.count_geki,
          count_katu: score.count_katu,
          count_miss: score.count_miss,
        },
      });
    } else {
      result.push({
        beatmap: b as AppBeatmap,
        score: undefined,
      });
    }
  }

  return createAppBeatmapsetFromAppBeatmaps(result);
}

function createAppBeatmapsetFromAppBeatmaps(beatmaps: AppBeatmapScore[]): AppBeatmapsetScore[] {
  const result: AppBeatmapsetScore[] = [];
  const setIds = Array.from(new Set(beatmaps.map((b) => b.beatmap.BeatmapsetId)));

  setIds.forEach((id) => {
    const beatmapsOfSet = beatmaps.filter((b) => b.beatmap.BeatmapsetId === id);
    result.push({
      artist: beatmapsOfSet[0].beatmap.Artist,
      creator: beatmapsOfSet[0].beatmap.Creator,
      date: new Date(beatmapsOfSet[0].beatmap.Date),
      id,
      link: '',
      status: beatmapsOfSet[0].beatmap.Status,
      title: beatmapsOfSet[0].beatmap.Title,
      beatmaps: beatmapsOfSet,
    });
  });
  return result;
}
