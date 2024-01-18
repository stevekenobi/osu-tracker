import { DatabaseClient, OsuClient } from '../../client';
import { LeaderboardUser } from '@/types';

export async function updateLeaderboard(osuClient: OsuClient, databaseClient: DatabaseClient) {
  console.log('starting updating leaderboard');
  let leaderboard: LeaderboardUser[] = [];
  const user = await databaseClient.getSystemUser();
  console.log(user);
  if (!user) return;
  let i = 1;
  let leaderboardResponse = await osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
  do {
    i++;
    if (!leaderboardResponse) {
      i--;
      continue;
    }
    leaderboard = leaderboard.concat(leaderboardResponse.ranking);
    leaderboardResponse = await osuClient.getCountryLeaderboard({ country: user.country_code, 'cursor[page]': i.toString() });
  } while (leaderboardResponse?.cursor);

  leaderboard.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

  await databaseClient.updateSystemUser(user, leaderboard.findIndex((leaderboardUser) => leaderboardUser.user.id === user.id) + 1);

  await databaseClient.updateLeaderboard(leaderboard.slice(0, 200));

  console.log('Updated leaderboard');
}
