const { isBeatmapRankedApprovedOrLoved } = require('../../utils');
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
          AR: b.ar,
          CS: b.cs,
          OD: b.accuracy,
          HP: b.drain,
          BPM: b.bpm,
          mode: b.mode,
          status: b.status,
          rankedDate: s.ranked_date,
        })),
    );
  }
  return beatmaps;
}

module.exports = { importLatestBeatmaps, importAllBeatmaps };
