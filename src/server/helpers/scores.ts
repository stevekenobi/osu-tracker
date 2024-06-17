import type { OsuUserBeatmap, OsuScore } from '../../types';
import { delay, getModsString, getRulesetFromInt, isBeatmapRankedApprovedOrLoved } from '../../utils';
import TrackerServer from '../server';
import { createBeatmapModelsFromOsuBeatmapsets } from './beatmaps';

export async function updateAllScores(): Promise<void> {
  console.log('started importing scores');
  let j = 0;
  let result = await TrackerServer.getOsuClient().getUserBeatmaps(12375044, 'most_played', { limit: 100 });
  do {
    const unfinished: OsuUserBeatmap[] = [];
    const scores: OsuScore[] = [];
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

    await updateScores(scores);
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

  await updateScores(result.filter((r) => isBeatmapRankedApprovedOrLoved(r.beatmap) && r.beatmap.mode === 'osu').map((s) => ({ score: s })));

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
      id: s.score.beatmap.id,
      unfinished: false,
      accuracy: s.score.accuracy * 100,
      max_combo: s.score.max_combo,
      mode: getRulesetFromInt(s.score.ruleset_id),
      mods: getModsString(s.score.mods),
      perfect: s.score.is_perfect_combo,
      pp: s.score.pp ?? 0,
      rank: s.score.rank,
      score: s.score.total_score,
      count_ok: s.score.statistics.ok ?? 0,
      count_great: s.score.statistics.great ?? 0,
      count_meh: s.score.statistics.meh ?? 0,
      count_miss: s.score.statistics.miss ?? 0,
    });
  } catch (error) {
    const beatmapset = await TrackerServer.getOsuClient().getBeatmapsetById(s.score.beatmap.beatmapset_id);
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
    console.log(error);
    const beatmapset = await TrackerServer.getOsuClient().getBeatmapsetById(beatmap.beatmapset.id);
    await TrackerServer.getDatabaseClient().updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset!]));
    await updateUnfinishedBeatmap(beatmap);
  }
}
