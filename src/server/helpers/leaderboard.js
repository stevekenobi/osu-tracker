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
  let cursor = {page: 1};
  do {
    const response = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': cursor.page });

    cursor = response.cursor;
    leaderboardUsers.push(...response.ranking);
  } while (cursor);

  await databaseClient.addLeaderboardUsers(leaderboardUsers.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1)).slice(0,100));
  await sheetClient.updateLeaderboard(leaderboardUsers.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1)).slice(0,100));
  console.log('finished updating leaderboard');
}

module.exports = { updateLeaderboard };
