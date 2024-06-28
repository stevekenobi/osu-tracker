import type { SheetStats, OsuBeatmapset, AppBeatmap, OsuBeatmap, AppBeatmapset, SheetBeatmap } from '../../types';
import { getYearsUntilToday, isBeatmapRankedApprovedOrLoved, delay, createBeatmapLinkFromId, calculateAverageAccuracy } from '../../utils';
import numeral from 'numeral';
import TrackerServer from '../server';
import { Op } from 'sequelize';

export async function importLatestBeatmaps(): Promise<void> {
  console.log('importing new beatmaps');
  const recentBeatmaps = await TrackerServer.getOsuClient().getBeatmapsetSearch();

  if (!recentBeatmaps) {
    throw new Error('could not find recent beatmaps');
  }

  await TrackerServer.getDatabaseClient().updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(recentBeatmaps.beatmapsets));
  console.log('finished importing new beatmaps');
}

export async function importAllBeatmaps(): Promise<void> {
  console.log('importing all beatmaps');
  let cursor_string = '';
  do {
    const beatmapSearch = await TrackerServer.getOsuClient().getBeatmapsetSearch({ cursor_string });

    if (!beatmapSearch) {
      continue;
    }

    await TrackerServer.getDatabaseClient().updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(beatmapSearch.beatmapsets));
    cursor_string = beatmapSearch.cursor_string;
  } while (cursor_string);

  console.log('finished importing all beatmaps');

  await addMissingBeatmaps(2927048);
  await addMissingBeatmaps(6699330);

  console.log('finished importing missing beatmaps');
}

export async function syncBeatmapsSheet(): Promise<void> {
  const years = getYearsUntilToday();
  const stats: SheetStats[] = [];
  for (const year of years) {
    const beatmaps = await TrackerServer.getDatabaseClient().getBeatmapsOfYear(year);
    await TrackerServer.getSheetClient().updateBeatmapsOfYear(
      year,
      createSheetBeatmapsFromApp(
        createBeatmapsetsFromBeatmaps(beatmaps)
          .sort((a, b) => (a.rankedDate > b.rankedDate ? 1 : -1))
          .flatMap((s) => s.beatmaps),
      ),
    );

    console.log(`finished ${year}`);

    const playedBeatmaps = beatmaps.filter((b) => b.rank);
    const totalScore = playedBeatmaps.reduce((sum, b) => sum + (b.score ? b.score : 0), 0);
    const totalClassicScore = playedBeatmaps.reduce((sum, b) => sum + (b.classicScore ? b.classicScore : 0), 0);
    const avgAccuracy = calculateAverageAccuracy(playedBeatmaps);

    stats.push({
      Year: year,
      'Total Beatmaps': numeral(beatmaps.length).format('0,0'),
      'Played Beatmaps': numeral(playedBeatmaps.length).format('0,0'),
      'Completion (%)': numeral((100 * playedBeatmaps.length) / beatmaps.length).format('0.00'),
      'Total Score': numeral(totalScore).format('0,0'),
      'Total Classic Score': numeral(totalClassicScore).format('0,0'),
      'Average Score': numeral(totalScore / playedBeatmaps.length).format('0,0'),
      'Average Accuracy': numeral(100 * avgAccuracy).format('0.00'),
      SSH: numeral(playedBeatmaps.filter((b) => b.rank === 'SSH').length).format('0,0'),
      SS: numeral(playedBeatmaps.filter((b) => b.rank === 'SS').length).format('0,0'),
      SH: numeral(playedBeatmaps.filter((b) => b.rank === 'SH').length).format('0,0'),
      S: numeral(playedBeatmaps.filter((b) => b.rank === 'S').length).format('0,0'),
      A: numeral(playedBeatmaps.filter((b) => b.rank === 'A').length).format('0,0'),
    });
  }

  await TrackerServer.getSheetClient().updateStats(stats);

  const allPlayedBeatmaps = await TrackerServer.getDatabaseClient().getBeatmaps({ where: { score: { [Op.gt]: 0 } } });
  const avgAccuracy = calculateAverageAccuracy(allPlayedBeatmaps);

  await TrackerServer.getSheetClient().updateOverallAccuracy(numeral(100 * avgAccuracy).format('0.00'));

  await TrackerServer.getSheetClient().updateProblematicBeatmaps(createSheetBeatmapsFromApp(await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps('problematic')));
  await TrackerServer.getSheetClient().updateNonSDBeatmaps(createSheetBeatmapsFromApp(await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps('non-sd')));
  await TrackerServer.getSheetClient().updateDtBeatmaps(createSheetBeatmapsFromApp(await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps('dt')));
  await TrackerServer.getSheetClient().updateArankBeatmaps(createSheetBeatmapsFromApp(await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps('a-ranks')));
  await TrackerServer.getSheetClient().updateSuboptimalBeatmaps(createSheetBeatmapsFromApp(await TrackerServer.getDatabaseClient().getUnfinishedBeatmaps('sub-optimal')));

  console.log('finished syncing beatmaps sheet');
}

export async function addMissingBeatmaps(userId: number): Promise<void> {
  console.log(`starting finding missing beatmaps of user ${userId}`);

  let j = 0;
  const allBeatmapIds = (await TrackerServer.getDatabaseClient().getBeatmaps()).map((b) => b.id);
  const missingIds: number[] = [];
  let result = await TrackerServer.getOsuClient().getUserBeatmaps(userId, 'most_played', { limit: 100 });
  do {
    if (!result) {
      result = await TrackerServer.getOsuClient().getUserBeatmaps(userId, 'most_played', { limit: 100, offset: j });
      continue;
    }
    j += 100;
    console.log(`getting ${j} out of about 115,000`);

    missingIds.push(
      ...result
        .filter((b) => b.beatmap.mode === 'osu' && isBeatmapRankedApprovedOrLoved(b.beatmap))
        .filter((b) => !allBeatmapIds.includes(b.beatmap_id))
        .map((b) => b.beatmapset.id),
    );

    result = await TrackerServer.getOsuClient().getUserBeatmaps(userId, 'most_played', { limit: 100, offset: j });

    await delay(500);
  } while (result!.length > 0);

  const missingSet = Array.from(new Set(missingIds));

  for (const id of missingSet) {
    const beatmapset = await TrackerServer.getOsuClient().getBeatmapsetById(id);
    if (!beatmapset) {
      throw new Error(`Did not find ${id}`);
    }
    await TrackerServer.getDatabaseClient().updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets([beatmapset]));
  }

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
          checksum: b.checksum,
          status: b.status,
          rankedDate: s.ranked_date,
          submittedDate: s.submitted_date,
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
      checksum: b.checksum,
      mode: b.mode,
      status: b.status,
      rankedDate: b.beatmapset.ranked_date,
      submittedDate: b.beatmapset.submitted_date,
    }));
}

export function createBeatmapsetsFromBeatmaps(beatmaps: AppBeatmap[]): AppBeatmapset[] {
  const beatmapsetIds = Array.from(new Set(beatmaps.map((b) => b.beatmapsetId)));
  const beatmapsets: AppBeatmapset[] = [];
  beatmapsetIds.forEach((i) => {
    const beatmapsFound = beatmaps.filter((b) => b.beatmapsetId === i).sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1));
    beatmapsets.push({
      id: i,
      beatmaps: beatmapsFound,
      rankedDate: beatmapsFound[0]!.rankedDate,
      submittedDate: beatmapsFound[0]!.submittedDate,
    });
  });

  return beatmapsets;
}

export function createSheetBeatmapsFromApp(beatmaps: AppBeatmap[]): SheetBeatmap[] {
  return beatmaps.map((b) => ({
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
    ...(b.rank && { Rank: b.rank }),
    ...(b.mods && { Mods: b.mods }),
    ...(b.accuracy && { Accuracy: numeral(b.accuracy).format('0.00') }),
    ...(b.score && { Score: numeral(b.score).format('0,0') }),
    ...(b.classicScore && { 'Classic Score': numeral(b.classicScore).format('0,0') }),
    ...(b.playedDate && { 'Played At': new Date(b.playedDate).toDateString() }),
  }));
}
