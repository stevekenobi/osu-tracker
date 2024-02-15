const { isBeatmapRankedApprovedOrLoved, getYearsUntilToday, delay } = require('../../utils');
/**
 * @param {OsuClient} osuClient
 * @param {DatabaseClient} databaseClient
 * @returns {Promise<void>}
 */
async function importLatestBeatmaps(osuClient, databaseClient) {
  console.log('importing new beatmaps');
  const recentBeatmaps = await osuClient.getBeatmapsetSearch();

  await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(recentBeatmaps.beatmapsets));
  console.log('finished importing new beatmaps');
}

/**
 * @param {OsuClient} osuClient
 * @param {DatabaseClient} databaseClient
 * @param {SheetClient} sheetClient
 * @returns {Promise<void>}
 */
async function importAllBeatmaps(osuClient, databaseClient, sheetClient) {
  console.log('importing all beatmaps');
  let cursor_string = '';
  /**@type {OsuBeatmapset[]} */
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

/**
 * @param {DatabaseClient} databaseClient
 * @param {SheetClient} sheetClient
 */
async function syncBeatmapsSheet(databaseClient, sheetClient) {
  const years = getYearsUntilToday();
  for (const year of years) {
    const beatmaps = await databaseClient.getBeatmapsOfYear(year);
    const yearlyBeatmaps = beatmaps.filter((b) => b.rankedDate.slice(0, 4) === year);
    await sheetClient.updateBeatmapsOfYear(
      year,
      createBeatmapsetsFromBeatmaps(yearlyBeatmaps)
        .sort((a, b) => (a.beatmaps[0].rankedDate > b.beatmaps[0].rankedDate ? 1 : -1))
        .flatMap((s) => s.beatmaps),
    );
    console.log(`finished ${year}`);
  }

  await sheetClient.updateProblematicBeatmaps(await databaseClient.getUnfinishedBeatmaps('problematic'));
  await sheetClient.updateNonSDBeatmaps(await databaseClient.getUnfinishedBeatmaps('non-sd'));
  await sheetClient.updateDtBeatmaps(await databaseClient.getUnfinishedBeatmaps('dt'));
}

/**
 * @param {OsuClient} osuClient
 * @param {DatabaseClient} databaseClient
 * @param {SheetClient} sheetClient
 * @param {string} userId
 */
async function findMissingBeatmaps(osuClient, databaseClient, sheetClient, userId) {
  console.log('starting finding missing beatmaps');
  let j = 0;
  /**@type {UserPlayedBeatmaps[]} */
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

/**
 * @param {OsuBeatmapset[]} beatmapsets
 * @returns {BeatmapModel[]}
 */
function createBeatmapModelsFromOsuBeatmapsets(beatmapsets) {
  /**@type {BeatmapModel[]} */
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

function createBeatmapModelsFromOsuBeatmaps(beatmaps) {
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

/**
 * @param {BeatmapModel[]} beatmaps
 */
function createBeatmapsetsFromBeatmaps(beatmaps) {
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

module.exports = {
  importLatestBeatmaps,
  importAllBeatmaps,
  syncBeatmapsSheet,
  findMissingBeatmaps,
  createBeatmapModelsFromOsuBeatmapsets,
  createBeatmapModelsFromOsuBeatmaps,
  createBeatmapsetsFromBeatmaps,
};
