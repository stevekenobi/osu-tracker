const { delay } = require('../../utils');

/**
 * @param {OsuClient} osuClient
 * @param {DatabaseClient} databaseClient
 */
async function updateScores(osuClient, databaseClient) {
  console.log('started importing scores');
  let j = 0;
  let result = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: 100 });
  do {
    const scores = [];
    if (!result) {
      result = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: 100, offset: j });
      continue;
    }

    for (const beatmap of result) {
      const score = await osuClient.getUserScoreOnBeatmap(beatmap.beatmap_id, 12375044);
      console.log(`${j + 1} - ${j + 100} score on ${beatmap.beatmap_id} ${score ? 'found' : 'not found'}`);
      if (score) scores.push(score.score);
    }
    await delay(2000);
    j += 100;

    await databaseClient.updateScores(
      scores.map((s) => ({
        accuracy: s.accuracy * 100,
        beatmap_id: s.beatmap.id,
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
  console.log('finished importing scores');
}

module.exports = { updateScores };