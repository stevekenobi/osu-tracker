import numeral from 'numeral';
import type OsuClient from '../../client/OsuClient';
import type SheetClient from '../../client/SheetClient';
import type { OsuLeaderboardUser, SheetLeaderboard } from '../../types';
import { createUserLinkFromId, getDaysFromToday } from '../../utils';

export async function updateLeaderboard(osuClient: OsuClient, sheetClient: SheetClient): Promise<void> {
  console.log('starting getting leaderboard');

  const leaderboardUsers: OsuLeaderboardUser[] = [];
  let cursor = { page: 1 };
  do {
    const response = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': cursor.page });
    if (!response) {
      continue;
    }

    cursor = response.cursor;
    leaderboardUsers.push(...response.ranking);
  } while (cursor);
  leaderboardUsers
    .sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

  await sheetClient.updateLeaderboard(createSheetLeaderboardFromOsuResponse(leaderboardUsers.slice(0, 100)));
  console.log('finished updating leaderboard');
}

function createSheetLeaderboardFromOsuResponse(users: OsuLeaderboardUser[]): SheetLeaderboard[] {
  return users.map((u, index) => ({
    '#': (index + 1).toString(),
    Link: createUserLinkFromId(u.user.id),
    Username: u.user.username,
    'Ranked Score': numeral(u.ranked_score).format('0,0'),
    'Total Score': numeral(u.total_score).format('0,0'),
    Accuracy: numeral(u.hit_accuracy).format('0.00'),
    Playcount: numeral(u.play_count).format('0,0'),
    SSH: numeral(u.grade_counts.ssh).format('0,0'),
    SS: numeral(u.grade_counts.ss).format('0,0'),
    SH: numeral(u.grade_counts.sh).format('0,0'),
    S: numeral(u.grade_counts.s).format('0,0'),
    A: numeral(u.grade_counts.a).format('0,0'),
  }));
}

export async function updateTargets(osuClient: OsuClient, sheetClient: SheetClient): Promise<void> {
  console.log('started updating targets');
  const myUser = await osuClient.getUserById(12375044);
  if (!myUser) {
    throw Error('did not find me stats');
  }

  const top50Response = await osuClient.getScoreLeaderboard();

  if (!top50Response) {
    throw Error('did not find top 50 response');
  }
  if (top50Response.ranking.length !== 50) {
    throw Error('did not find top 50 response');
  }

  const scoreToTop50 = (top50Response.ranking[49]!.ranked_score - myUser.statistics.ranked_score) / getDaysFromToday(new Date(2025, 0, 1));

  const top100Response = await osuClient.getScoreLeaderboard({ 'cursor[page]': 2 });
  if (!top100Response) {
    throw Error('did not find top 100 response');
  }
  if (top100Response.ranking.length !== 50) {
    throw Error('did not find top 100 response');
  }

  const scoreToTop100 = (top100Response.ranking[49]!.ranked_score - myUser.statistics.ranked_score) / getDaysFromToday(new Date(2024, 8, 1));

  await sheetClient.updateTargets([{
    'Target': 'Top 50 by the end of the year',
    'Score to Earn': numeral(scoreToTop50).format('0,0'),
    'Target Score': numeral(scoreToTop50 + myUser.statistics.ranked_score).format('0,0'),
  },
  {
    'Target': 'Top 100 by September',
    'Score to Earn': numeral(scoreToTop100).format('0,0'),
    'Target Score': numeral(scoreToTop100 + myUser.statistics.ranked_score).format('0,0'),
  }]);

  console.log('finished updating targets');
}
