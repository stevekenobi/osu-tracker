const { delay, isBeatmapRankedApprovedOrLoved } = require('../../utils');

/**
 * @param {OsuClient} osuClient
 * @param {DatabaseClient} databaseClient
 * @param {SheetClient} sheetClient
 */
async function updateScores(osuClient, databaseClient, sheetClient) {
  console.log('started importing scores');
  const unfinished = [];
  let j = 0;
  let result = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: 100 });
  do {
    const scores = [];
    if (!result) {
      result = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: 100, offset: j });
      continue;
    }

    result
      .filter((r) => isBeatmapRankedApprovedOrLoved(r.beatmap) && r.beatmap.mode === 'osu')
      .forEach(async (beatmap) => {
        const score = await osuClient.getUserScoreOnBeatmap(beatmap.beatmap_id, 12375044);
        console.log(`${j + 1} - ${j + 100} score on ${beatmap.beatmap_id} ${score ? 'found' : 'not found'}`);
        if (score) {
          scores.push(score.score);
        } else unfinished.push(beatmap);
      });

    await delay(5000);
    j += 100;

    const beatmapsMissing = [];
    const beatmapsInDatabase = await databaseClient.beatmapsExists(scores.map((s) => s.beatmap.id));

    if (!beatmapsInDatabase) {
      for (const s of scores) {
        const beatmap = await osuClient.getBeatmapById(s.beatmap.id);
        beatmapsMissing.push(beatmap);
      }

      await databaseClient.updateBeatmaps(
        beatmapsMissing.map((b) => ({
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
          status: b.status,
          mode: b.mode,
          rankedDate: b.beatmapset.ranked_date,
        })),
      );
    }

    await databaseClient.updateScores(
      scores.map((s) => ({
        accuracy: s.accuracy * 100,
        beatmap_id: s.beatmap.id,
        BeatmapId: s.beatmap.id,
        max_combo: s.max_combo,
        mode: s.mode,
        mods: s.mods.join(','),
        perfect: s.perfect,
        pp: s.pp,
        rank: s.rank,
        score: s.score,
        count_100: s.statistics.count_100,
        count_300: s.statistics.count_300,
        count_50: s.statistics.count_50,
        count_miss: s.statistics.count_miss,
      })),
    );
    result = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: 100, offset: j });
  } while (result.length > 0);
  await sheetClient.updateNoScoreBeatmaps(unfinished.sort((a, b) => (a.beatmap.difficulty_rating > b.beatmap.difficulty_rating ? 1 : -1)));
  console.log('finished importing scores');
}

module.exports = { updateScores };
