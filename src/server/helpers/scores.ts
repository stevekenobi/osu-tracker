import type DatabaseClient from '../../client/DatabaseClient';
import type OsuClient from '../../client/OsuClient';
import type { OsuUserBeatmap, OsuScore } from '../../types';
import { delay, getModsString, getRulesetFromInt, isBeatmapRankedApprovedOrLoved } from '../../utils';
import { createBeatmapModelsFromOsuBeatmapsets } from './beatmaps';

export async function updateAllScores(osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  console.log('started importing scores');
  let j = 0;
  let result = await osuClient.getUserBeatmaps(12375044, 'most_played', { limit: 100 });
  do {
    const unfinished: OsuUserBeatmap[] = [];
    const scores: OsuScore[] = [];
    if (!result) {
      result = await osuClient.getUserBeatmaps(12375044, 'most_played', { limit: 100, offset: j });
      continue;
    }

    result.filter((r) => isBeatmapRankedApprovedOrLoved(r.beatmap) && r.beatmap.mode === 'osu').forEach(beatmap => {
      (async (): Promise<void> => {
        const score = await osuClient.getUserScoreOnBeatmap(beatmap.beatmap_id, 12375044);
        console.log(`${j + 1} - ${j + 100} score on ${beatmap.beatmap_id} ${score ? 'found' : 'not found'}`);
        if (score) {
          scores.push(score);
        } else {
          unfinished.push(beatmap);
        }
      })();
    });

    await delay(5000);
    j += 100;

    await updateScores(scores, osuClient, databaseClient);
    await addUnfinishedBeatmaps(unfinished, osuClient, databaseClient);
    result = await osuClient.getUserBeatmaps(12375044, 'most_played', { limit: 100, offset: j });
  } while (result!.length > 0);
  console.log('finished importing scores');
}

export async function updateRecentScores(osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  console.log('started importing recent scores');
  const result = await osuClient.getUserRecentScores(12375044);

  if (!result) {
    throw new Error('failed to get response for recent scores');
  }

  if (result.length === 0) {
    console.log('no recent scores');
    return;
  }

  await updateScores(result.filter((r) => isBeatmapRankedApprovedOrLoved(r.beatmap) && r.beatmap.mode === 'osu').map(s => ({ score: s })), osuClient, databaseClient);

  console.log('finished updating recent scores');
}

export async function updateScores(scores: OsuScore[], osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  for (const s of scores) {
    await updateScore(s, osuClient, databaseClient);
  }
}

export async function updateScore(s: OsuScore, osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  try {
    await databaseClient.updateScore({
      id: s.score.beatmap.id,
      unfinished: false,
      accuracy: s.score.accuracy * 100,
      max_combo: s.score.max_combo,
      mode: getRulesetFromInt(s.score.ruleset_id),
      mods: getModsString(s.score.mods),
      perfect: s.score.is_perfect_combo,
      pp: s.score.pp,
      rank: s.score.rank,
      score: s.score.total_score,
      count_ok: s.score.statistics.ok,
      count_great: s.score.statistics.great,
      count_meh: s.score.statistics.meh,
      count_miss: s.score.statistics.miss,
    });
  } catch (error) {
    const beatmapset = await osuClient.getBeatmapsetById(s.score.beatmap.beatmapset_id);
    await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset!]));
    await updateScore(s, osuClient, databaseClient);
  }
}

export async function addUnfinishedBeatmaps(beatmaps: OsuUserBeatmap[], osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  for (const b of beatmaps) {
    await updateUnfinishedBeatmap(b, osuClient, databaseClient);
  }
}

export async function updateUnfinishedBeatmap(beatmap: OsuUserBeatmap, osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  try {
    await databaseClient.addUnfinishedBeatmap(beatmap.beatmap_id);
  }
  catch (error) {
    console.log(error);
    const beatmapset = await osuClient.getBeatmapsetById(beatmap.beatmapset.id);
    await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset!]));
    await updateUnfinishedBeatmap(beatmap, osuClient, databaseClient);
  }
}
