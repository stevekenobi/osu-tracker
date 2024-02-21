import { isBeatmapRankedApprovedOrLoved, getYearsUntilToday, delay } from '../../utils';

export async function importLatestBeatmaps(osuClient, databaseClient) {
  console.log('importing new beatmaps');
  const recentBeatmaps = await osuClient.getBeatmapsetSearch();

  await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(recentBeatmaps.beatmapsets));
  console.log('finished importing new beatmaps');
}

export async function importAllBeatmaps(osuClient, databaseClient, sheetClient) {
  console.log('importing all beatmaps');
  let cursor_string = '';
  do {
    const beatmapSearch = await osuClient.getBeatmapsetSearch({ cursor_string });

    await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(beatmapSearch.beatmapsets));
    cursor_string = beatmapSearch.cursor_string;
  } while (cursor_string);

  console.log('finished importing all beatmaps');

  const missingBeatmapIds = await sheetClient.getMissingBeatmaps();
  console.log('total missing maps', missingBeatmapIds);

  for (const id of missingBeatmapIds) {
    const beatmap = await osuClient.getBeatmapById(id);
    if (!beatmap) throw new Error(`Did not find ${id}`);
    if (!isBeatmapRankedApprovedOrLoved(beatmap)) console.log(`found ${beatmap.status} map`);
    if (beatmap.mode !== 'osu') console.log(`found ${beatmap.mode} map`);
    await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmaps([beatmap]));
  }

  console.log('finished importing missing beatmaps');
}

export async function syncBeatmapsSheet(databaseClient, sheetClient) {
  const years = getYearsUntilToday();
  const stats = [];
  for (const year of years) {
    const beatmaps = await databaseClient.getBeatmapsOfYear(year);
    await sheetClient.updateBeatmapsOfYear(
      year,
      createBeatmapsetsFromBeatmaps(beatmaps)
        .sort((a, b) => (a.beatmaps[0].rankedDate > b.beatmaps[0].rankedDate ? 1 : -1))
        .flatMap((s) => s.beatmaps),
    );
    console.log(`finished ${year}`);
    const playedBeatmaps = beatmaps.filter((b) => b.score);
    const totalScore = playedBeatmaps.reduce((sum, b) => sum + Number.parseInt(b.score), 0);
    stats.push({
      Year: year,
      'Total Beatmaps': beatmaps.length,
      'Played Beatmaps': playedBeatmaps.length,
      Completion: (100 * playedBeatmaps.length) / beatmaps.length,
      'Total Score': totalScore,
      'Average Score': totalScore / playedBeatmaps.length,
    });
  }

  await sheetClient.updateStats(stats);

  await sheetClient.updateProblematicBeatmaps(await databaseClient.getUnfinishedBeatmaps('problematic'));
  await sheetClient.updateNonSDBeatmaps(await databaseClient.getUnfinishedBeatmaps('non-sd'));
  await sheetClient.updateDtBeatmaps(await databaseClient.getUnfinishedBeatmaps('dt'));
}

export async function findMissingBeatmaps(osuClient, databaseClient, sheetClient, userId) {
  console.log('starting finding missing beatmaps');
  let j = 0;
  const allBeatmapIds = (await databaseClient.getBeatmaps()).map((b) => b.id);
  let result = await osuClient.getUserBeamaps(userId, 'most_played', { limit: 100 });
  do {
    if (!result) {
      result = await osuClient.getUserBeamaps(userId, 'most_played', { limit: 100, offset: j });
      console.log('got here');
      continue;
    }
    j += 100;

    const missingBeatmaps = result.filter((b) => b.beatmap.mode === 'osu' && isBeatmapRankedApprovedOrLoved(b.beatmap)).filter((b) => !allBeatmapIds.includes(b.beatmap_id.toString()));

    await sheetClient.updateMissingBeatmaps(missingBeatmaps.map((x) => x.beatmap_id));
    result = await osuClient.getUserBeamaps(userId, 'most_played', { limit: 100, offset: j });

    await delay(500);
  } while (result.length > 0);
  console.log('finished finding missing beatmaps');
}

export function createBeatmapModelsFromOsuBeatmapsets(beatmapsets) {
  const beatmaps = [];
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

export function createBeatmapModelsFromOsuBeatmaps(beatmaps) {
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

export function createBeatmapsetsFromBeatmaps(beatmaps) {
  const beatmapsetIds = Array.from(new Set(beatmaps.map((b) => b.beatmapsetId)));
  const beatmapsets = [];
  beatmapsetIds.forEach((i) => {
    beatmapsets.push({
      id: i,
      beatmaps: beatmaps.filter((b) => b.beatmapsetId === i).sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1)),
    });
  });

  return beatmapsets;
}
