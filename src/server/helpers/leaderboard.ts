export async function updateLeaderboard(osuClient, sheetClient) {
  console.log('starting getting leaderboard');

  const leaderboardUsers = [];
  let cursor = { page: 1 };
  do {
    const response = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': cursor.page });

    cursor = response.cursor;
    leaderboardUsers.push(...response.ranking);
  } while (cursor);
  leaderboardUsers
    .sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

  await sheetClient.updateLeaderboard(leaderboardUsers.slice(0, 100));
  console.log('finished updating leaderboard');
}
