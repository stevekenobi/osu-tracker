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
 * @param {OsuBeatmapset[]} beatmapsets 
 * @returns {BeatmapModel[]}
 */
function createBeatmapModelsFromOsuBeatmapsets(beatmapsets) {
  /**@type {BeatmapModel[]} */
  const beatmaps = [];
  for (const s of beatmapsets)  {
    beatmaps.push(...s.beatmaps.map(b => ({
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
      rankedDate: s.ranked_date
    })));
  }
  return beatmaps;
}

module.exports = { importLatestBeatmaps };
