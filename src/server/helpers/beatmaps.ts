import type DatabaseClient from '../../client/DatabaseClient';
import type OsuClient from '../../client/OsuClient';
import type SheetClient from '../../client/SheetClient';
import type { Beatmaps } from '../../client/models/Beatmaps';
import type { OsuBeatmapset, AppBeatmap, OsuBeatmap, AppBeatmapset, SheetBeatmap } from '../../types';
import { isBeatmapRankedApprovedOrLoved, getYearsUntilToday, delay, createBeatmapLinkFromId } from '../../utils';
import numeral from 'numeral';

export async function importLatestBeatmaps(osuClient: OsuClient, databaseClient: DatabaseClient): Promise<void> {
  console.log('importing new beatmaps');
  const recentBeatmaps = await osuClient.getBeatmapsetSearch();

  if (!recentBeatmaps) throw new Error('could not find recent beatmaps');

  await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(recentBeatmaps.beatmapsets));
  console.log('finished importing new beatmaps');
}

export async function importAllBeatmaps(osuClient: OsuClient, databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<void> {
  console.log('importing all beatmaps');
  let cursor_string = '';
  do {
    const beatmapSearch = await osuClient.getBeatmapsetSearch({ cursor_string });

    if (!beatmapSearch) continue;

    await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(beatmapSearch.beatmapsets));
    cursor_string = beatmapSearch.cursor_string;
  } while (cursor_string);

  console.log('finished importing all beatmaps');

  const missingBeatmapIds = await sheetClient.getMissingBeatmaps();
  console.log('total missing maps', missingBeatmapIds);

  for (const id of missingBeatmapIds) {
    const beatmapset = await osuClient.getBeatmapsetById(id);
    if (!beatmapset) throw new Error(`Did not find ${id}`);
    await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset]));
  }

  console.log('finished importing missing beatmaps');
}

export async function syncBeatmapsSheet(databaseClient: DatabaseClient, sheetClient: SheetClient): Promise<void> {
  const years = getYearsUntilToday();
  const stats = [];
  for (const year of years) {
    const beatmaps = await databaseClient.getBeatmapsOfYear(year);
    await sheetClient.updateBeatmapsOfYear(
      year,
      createSheetBeatmapsFromApp(
        createBeatmapsetsFromBeatmaps(beatmaps)
          .sort((a, b) => (a.beatmaps[0]!.rankedDate > b.beatmaps[0]!.rankedDate ? 1 : -1))
          .flatMap((s) => s.beatmaps),
      ));
    console.log(`finished ${year}`);
    const playedBeatmaps = beatmaps.filter((b) => b.score);
    const totalScore = playedBeatmaps.reduce((sum, b) => sum + (b.score ? b.score : 0), 0);
    stats.push({
      Year: year,
      'Total Beatmaps': numeral(beatmaps.length).format('0,0'),
      'Played Beatmaps': numeral(playedBeatmaps.length).format('0,0'),
      Completion: numeral((100 * playedBeatmaps.length) / beatmaps.length).format('0.00'),
      'Total Score': numeral(totalScore).format('0,0'),
      'Average Score': numeral(totalScore / playedBeatmaps.length).format('0,0'),
    });
  }

  await sheetClient.updateStats(stats);

  await sheetClient.updateProblematicBeatmaps(createSheetBeatmapsFromApp(await databaseClient.getUnfinishedBeatmaps('problematic')));
  await sheetClient.updateNonSDBeatmaps(createSheetBeatmapsFromApp(await databaseClient.getUnfinishedBeatmaps('non-sd')));
  await sheetClient.updateDtBeatmaps(createSheetBeatmapsFromApp(await databaseClient.getUnfinishedBeatmaps('dt')));
}

export async function findMissingBeatmaps(osuClient: OsuClient, databaseClient: DatabaseClient, sheetClient: SheetClient, userId: number): Promise<void> {
  console.log('starting finding missing beatmaps');
  let j = 0;
  const allBeatmapIds = (await databaseClient.getBeatmaps()).map((b) => b.id);
  const missingIds: number[] = [];
  let result = await osuClient.getUserBeatmaps(userId, 'most_played', { limit: 100 });
  do {
    if (!result) {
      result = await osuClient.getUserBeatmaps(userId, 'most_played', { limit: 100, offset: j });
      console.log('got here');
      continue;
    }
    j += 100;

    missingIds.push(...result.filter((b) => b.beatmap.mode === 'osu' && isBeatmapRankedApprovedOrLoved(b.beatmap)).filter((b) => !allBeatmapIds.includes(b.beatmap_id)).map(b => b.beatmapset.id));

    result = await osuClient.getUserBeatmaps(userId, 'most_played', { limit: 100, offset: j });

    await delay(500);
  } while (result!.length > 0);

  await sheetClient.updateMissingBeatmaps(Array.from(new Set(missingIds)));
  console.log('finished finding missing beatmaps');
}

export function createBeatmapModelsFromOsuBeatmapsets(beatmapsets: OsuBeatmapset[]): AppBeatmap[] {
  const beatmaps: AppBeatmap[] = [];
  for (const s of beatmapsets) {
    beatmaps.push(
      ...s.beatmaps
        .filter((b) => isBeatmapRankedApprovedOrLoved(b))
        .filter((b) => b.mode === 'osu')
        .map((b) => ({
          id: b.id,
          beatmapsetId: s.id,
          artist: s.artist,
          title: s.title,
          creator: s.creator,
          version: b.version,
          difficulty: b.difficulty_rating,
          AR: b.ar,
          CS: b.cs,
          OD: b.accuracy,
          HP: b.drain,
          BPM: b.bpm,
          length: b.total_length,
          mode: b.mode,
          status: b.status,
          rankedDate: s.ranked_date,
        })),
    );
  }
  return beatmaps;
}

export function createBeatmapModelsFromOsuBeatmaps(beatmaps: OsuBeatmap[]): AppBeatmap[] {
  return beatmaps
    .filter((b) => isBeatmapRankedApprovedOrLoved(b))
    .filter((b) => b.mode === 'osu')
    .map((b) => ({
      id: b.id,
      beatmapsetId: b.beatmapset_id,
      artist: b.beatmapset.artist,
      title: b.beatmapset.title,
      creator: b.beatmapset.creator,
      version: b.version,
      difficulty: b.difficulty_rating,
      AR: b.ar,
      CS: b.cs,
      OD: b.accuracy,
      HP: b.drain,
      BPM: b.bpm,
      length: b.total_length,
      mode: b.mode,
      status: b.status,
      rankedDate: b.beatmapset.ranked_date,
    }));
}

export function createBeatmapsetsFromBeatmaps(beatmaps: Beatmaps[]): AppBeatmapset[] {
  const beatmapsetIds = Array.from(new Set(beatmaps.map((b) => b.beatmapsetId)));
  const beatmapsets: AppBeatmapset[] = [];
  beatmapsetIds.forEach((i) => {
    beatmapsets.push({
      id: i,
      beatmaps: beatmaps.filter((b) => b.beatmapsetId === i).sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1)),
    });
  });

  return beatmapsets;
}

export function createSheetBeatmapsFromApp(beatmaps: AppBeatmap[]): SheetBeatmap[] {
  return beatmaps.map(b => ({
    Link: createBeatmapLinkFromId(b.id),
    Artist: b.artist,
    Title: b.title,
    Creator: b.creator,
    Version: b.version,
    Difficulty: b.difficulty.toString(),
    Status: b.status,
    BPM: b.BPM.toString(),
    AR: b.AR.toString(),
    CS: b.CS.toString(),
    HP: b.HP.toString(),
    OD: b.OD.toString(),
    Length: b.length.toString(),
    ...(b.rank) && { Rank: b.rank },
    ...(b.mods) && { Mods: b.mods },
    ...(b.accuracy) && { Accuracy: numeral(b.accuracy).format('0.00') },
    ...(b.score) && { Score: numeral(b.score).format('0,0') },
  }));
}
