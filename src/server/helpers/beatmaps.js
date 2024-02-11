const { isBeatmapRankedApprovedOrLoved, getYearsUntilToday } = require('../../utils');
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
 * @returns {Promise<void>}
 */
async function importAllBeatmaps(osuClient, databaseClient) {
  console.log('importing all beatmaps');
  let cursor_string = '';
  /**@type {OsuBeatmapset[]} */
  const beatmapsets = [];
  do {
    const beatmapSearch = await osuClient.getBeatmapsetSearch({ cursor_string });
    beatmapsets.push(...beatmapSearch.beatmapsets);

    cursor_string = beatmapSearch.cursor_string;
  } while (cursor_string);

  await databaseClient.updateBeatmaps(createBeatmapModelsFromOsuBeatmapsets(beatmapsets));
  console.log('finished importing all beatmaps');
}

/**
 *
 * @param {DatabaseClient} databaseClient
 * @param {SheetClient} sheetClient
 */
async function syncBeatmapsSheet(databaseClient, sheetClient) {
  const beatmaps = await databaseClient.getBeatmaps();

  const years = getYearsUntilToday();
  for (const year of years) {
    const yearlyBeatmaps = beatmaps.filter((b) => b.rankedDate.getFullYear().toString() === year);
    await sheetClient.updateBeatmapsOfYear(
      year,
      createBeatmapsetsFromBeatmaps(yearlyBeatmaps)
        .sort((a, b) => (a.beatmaps[0].rankedDate > b.beatmaps[0].rankedDate ? 1 : -1))
        .flatMap((s) => s.beatmaps),
    );
    console.log(`finished ${year}`);
  }
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

module.exports = { importLatestBeatmaps, importAllBeatmaps, syncBeatmapsSheet };
