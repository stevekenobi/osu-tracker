const DatabaseClient = require('../../client/DatabaseClient');
const OsuClient = require('../../client/OsuClient');
const SheetClient = require('../../client/SheetClient');

/**
 * @param {OsuClient} osuClient
 * @param {DatabaseClient} databaseClient
 * @param {SheetClient} sheetClient
 * @returns {Promise<void>}
 */
async function updateLeaderboard(osuClient, databaseClient, sheetClient) {
  console.log('starting getting leaderboard');

  const leaderboardUsers = [];
  let cursor = { page: 1 };
  do {
    const response = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': cursor.page });

    cursor = response.cursor;
    leaderboardUsers.push(...response.ranking);
  } while (cursor);

  await databaseClient.addLeaderboardUsers(
    leaderboardUsers
      .sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1))
      .slice(0, 100)
      .map((u) => ({
        id: u.user.id,
        username: u.user.username,
        rankedScore: u.ranked_score,
        totalScore: u.total_score,
        hitAccuracy: u.hit_accuracy,
        playcount: u.play_count,
        SSH: u.grade_counts.ssh,
        SS: u.grade_counts.ss,
        SH: u.grade_counts.sh,
        S: u.grade_counts.s,
        A: u.grade_counts.a,
      })),
  );
  await sheetClient.updateLeaderboard(leaderboardUsers.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1)).slice(0, 100));
  console.log('finished updating leaderboard');
}

module.exports = { updateLeaderboard };
