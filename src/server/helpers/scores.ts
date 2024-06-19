import type { OsuUserBeatmap, OsuScore, OsuUserScore } from '../../types';
import { calculateClassicScore, delay, getModsString, getRulesetFromInt, isBeatmapRankedApprovedOrLoved } from '../../utils';
import TrackerServer from '../server';
import { createBeatmapModelsFromOsuBeatmapsets } from './beatmaps';

export async function updateAllScores(): Promise<void> {
  console.log('started importing scores');
  let j = 0;
  let result = await TrackerServer.getOsuClient().getUserBeatmaps(12375044, 'most_played', { limit: 100 });
  do {
    const unfinished: OsuUserBeatmap[] = [];
    const scores: OsuUserScore[] = [];
    if (!result) {
      result = await TrackerServer.getOsuClient().getUserBeatmaps(12375044, 'most_played', { limit: 100, offset: j });
      continue;
    }

    result
      .filter((r) => isBeatmapRankedApprovedOrLoved(r.beatmap) && r.beatmap.mode === 'osu')
      .forEach((beatmap) => {
        (async (): Promise<void> => {
          const score = await TrackerServer.getOsuClient().getUserScoreOnBeatmap(beatmap.beatmap_id, 12375044);
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

    await updateScores(scores.map((s) => s.score));
    await addUnfinishedBeatmaps(unfinished);
    result = await TrackerServer.getOsuClient().getUserBeatmaps(12375044, 'most_played', { limit: 100, offset: j });
  } while (result!.length > 0);
  console.log('finished importing scores');
}

export async function updateRecentScores(): Promise<void> {
  console.log('started importing recent scores');
  const result = await TrackerServer.getOsuClient().getUserRecentScores(12375044);

  if (!result) {
    throw new Error('failed to get response for recent scores');
  }

  if (result.length === 0) {
    console.log('no recent scores');
    return;
  }

  await updateScores(result.filter((s) => isBeatmapRankedApprovedOrLoved(s.beatmap) && s.beatmap.mode === 'osu'));

  console.log('finished updating recent scores');
}

export async function updateScores(scores: OsuScore[]): Promise<void> {
  for (const s of scores) {
    await updateScore(s);
  }
}

export async function updateScore(s: OsuScore): Promise<void> {
  try {
    await TrackerServer.getDatabaseClient().updateScore({
      id: s.beatmap.id,
      unfinished: false,
      accuracy: s.accuracy * 100,
      max_combo: s.max_combo,
      mode: getRulesetFromInt(s.ruleset_id),
      mods: getModsString(s.mods),
      perfect: s.is_perfect_combo,
      pp: s.pp ?? 0,
      rank: s.rank,
      score: s.total_score,
      classicScore: calculateClassicScore(s),
      count_ok: s.statistics.ok ?? 0,
      count_great: s.statistics.great ?? 0,
      count_meh: s.statistics.meh ?? 0,
      count_miss: s.statistics.miss ?? 0,
    });
  } catch (error) {
    const beatmapset = await TrackerServer.getOsuClient().getBeatmapsetById(s.beatmap.beatmapset_id);
    await TrackerServer.getDatabaseClient().updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset!]));
    await updateScore(s);
  }
}

export async function addUnfinishedBeatmaps(beatmaps: OsuUserBeatmap[]): Promise<void> {
  for (const b of beatmaps) {
    await updateUnfinishedBeatmap(b);
  }
}

export async function updateUnfinishedBeatmap(beatmap: OsuUserBeatmap): Promise<void> {
  try {
    await TrackerServer.getDatabaseClient().addUnfinishedBeatmap(beatmap.beatmap_id);
  } catch (error) {
    const beatmapset = await TrackerServer.getOsuClient().getBeatmapsetById(beatmap.beatmapset.id);
    await TrackerServer.getDatabaseClient().updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset!]));
    await updateUnfinishedBeatmap(beatmap);
  }
}
