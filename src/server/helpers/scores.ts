import type DatabaseClient from '../../client/DatabaseClient';
import type OsuClient from '../../client/OsuClient';
import type SheetClient from '../../client/SheetClient';
import type { OsuUserBeatmap, OsuScore } from '../../types';
import { createBeatmapLinkFromId, delay, isBeatmapRankedApprovedOrLoved } from '../../utils';
import { createBeatmapModelsFromOsuBeatmapsets } from './beatmaps';
import numeral from 'numeral';

export async function updateScores(osuClient: OsuClient, databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<void> {
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

    result
      .filter((r) => isBeatmapRankedApprovedOrLoved(r.beatmap) && r.beatmap.mode === 'osu')
      .forEach(async (beatmap) => {
        const score = await osuClient.getUserScoreOnBeatmap(beatmap.beatmap_id, 12375044);
        console.log(`${j + 1} - ${j + 100} score on ${beatmap.beatmap_id} ${score ? 'found' : 'not found'}`);
        if (score) {
          scores.push(score);
        } else unfinished.push(beatmap);
      });

    await delay(5000);
    j += 100;

    for (const s of scores) {
      try {
        await databaseClient.updateScore({
          id: s.score.beatmap.id,
          accuracy: s.score.accuracy * 100,
          max_combo: s.score.max_combo,
          mode: s.score.mode,
          mods: s.score.mods.join(','),
          perfect: s.score.perfect,
          pp: s.score.pp,
          rank: s.score.rank,
          score: s.score.score,
          count_100: s.score.statistics.count_100,
          count_300: s.score.statistics.count_300,
          count_50: s.score.statistics.count_50,
          count_miss: s.score.statistics.count_miss,
        });
      } catch (error) {
        const beatmapset = await osuClient.getBeatmapsetById(s.score.beatmap.beatmapset_id);
        await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset!]));

        await databaseClient.updateScore({
          id: s.score.beatmap.id,
          accuracy: s.score.accuracy * 100,
          max_combo: s.score.max_combo,
          mode: s.score.mode,
          mods: s.score.mods.join(','),
          perfect: s.score.perfect,
          pp: s.score.pp,
          rank: s.score.rank,
          score: s.score.score,
          count_100: s.score.statistics.count_100,
          count_300: s.score.statistics.count_300,
          count_50: s.score.statistics.count_50,
          count_miss: s.score.statistics.count_miss,
        });
      }
    }
    result = await osuClient.getUserBeatmaps(12375044, 'most_played', { limit: 100, offset: j });
  } while (result!.length > 0);
  await sheetClient.updateNoScoreBeatmaps(unfinished.sort((a, b) => (a.beatmap.difficulty_rating > b.beatmap.difficulty_rating ? 1 : -1)).map(b => ({
    Link: createBeatmapLinkFromId(b.beatmap_id),
    Artist: b.beatmapset.artist,
    Title: b.beatmapset.title,
    Creator: b.beatmapset.creator,
    Version: b.beatmap.version,
    Difficulty: numeral(b.beatmap.difficulty_rating).format('0,0'),
    Length: numeral(b.beatmap.total_length).format('0,0'),
    Playcount: numeral(b.count).format('0,0'),
    Status: b.beatmap.status,
  })));
  console.log('finished importing scores');
}
