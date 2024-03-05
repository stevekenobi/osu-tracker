import type DatabaseClient from '../../client/DatabaseClient';
import type OsuClient from '../../client/OsuClient';
import type SheetClient from '../../client/SheetClient';
import type { OsuUserBeatmap, OsuScore } from '../../types';
import { createBeatmapLinkFromId, delay, getModsString, getRulesetFromInt, isBeatmapRankedApprovedOrLoved } from '../../utils';
import { createBeatmapModelsFromOsuBeatmapsets } from './beatmaps';
import numeral from 'numeral';

export async function updateAllScores(osuClient: OsuClient, databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<void> {
  console.log('started importing scores');
  const unfinished: OsuUserBeatmap[] = [];
  let j = 0;
  let result = await osuClient.getUserBeatmaps(12375044, 'most_played', { limit: 100 });
  do {
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
    result = await osuClient.getUserBeatmaps(12375044, 'most_played', { limit: 100, offset: j });
  } while (result!.length > 0);
  unfinished.sort((a, b) => (a.beatmap.difficulty_rating > b.beatmap.difficulty_rating ? 1 : -1));
  await sheetClient.updateNoScoreBeatmaps(unfinished.map(b => ({
    Link: createBeatmapLinkFromId(b.beatmap_id),
    Artist: b.beatmapset.artist,
    Title: b.beatmapset.title,
    Creator: b.beatmapset.creator,
    Version: b.beatmap.version,
    Difficulty: numeral(b.beatmap.difficulty_rating).format('0.00'),
    Length: numeral(b.beatmap.total_length).format('0,0'),
    Playcount: numeral(b.count).format('0,0'),
    Status: b.beatmap.status,
  })));
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
    try {
      await databaseClient.updateScore({
        id: s.score.beatmap.id,
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
      await updateScores(scores, osuClient, databaseClient);
    }
  }
}
