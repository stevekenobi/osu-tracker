import { DatabaseClient, OsuClient, Beatmaps, Scores } from '../../client';
import { UserScore, UserPlayedBeatmaps, AppBeatmapScore, AppBeatmapsetScore } from '@/types';
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

  await databaseClient.updateUserScores(userScores, user.id);
  await databaseClient.updateUnfinishedBeatmaps(user.id, unfinished);
}

export async function getUserScores(): Promise<AppBeatmapsetScore[]> {
  const result: AppBeatmapScore[] = [];
  const beatmaps = await Beatmaps.findAll();
  for (const b of beatmaps) {
    const score = await Scores.findByPk();

    if (score) {
      result.push({
        beatmap: {
          link: `https://osu.ppy.sh/b/${b.id}`,
          ...b,
        },
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
        beatmap: {
          link: `https://osu.ppy.sh/b/${b.id}`,
          ...b,
        },
        score: undefined,
      });
    }
  }

  return createAppBeatmapsetFromAppBeatmaps(result);
}

function createAppBeatmapsetFromAppBeatmaps(beatmaps: AppBeatmapScore[]): AppBeatmapsetScore[] {
  const result: AppBeatmapsetScore[] = [];
  const setIds = Array.from(new Set(beatmaps.map((b) => b.beatmap.beatmapset_id)));

  setIds.forEach((id) => {
    const beatmapsOfSet = beatmaps.filter((b) => b.beatmap.beatmapset_id === id);
    result.push({
      artist: beatmapsOfSet[0].beatmap.artist,
      creator: beatmapsOfSet[0].beatmap.creator,
      date: new Date(beatmapsOfSet[0].beatmap.ranked_date),
      id,
      link: '',
      status: beatmapsOfSet[0].beatmap.status,
      title: beatmapsOfSet[0].beatmap.title,
      beatmaps: beatmapsOfSet,
    });
  });
  return result;
}
