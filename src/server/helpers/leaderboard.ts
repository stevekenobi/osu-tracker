import type OsuClient from '@/src/client/OsuClient';
import type SheetClient from '@/src/client/SheetClient';
import type { OsuLeaderboardUser, SheetLeaderboard } from '@/src/types';
import { createUserLinkFromId } from '@/src/utils';
import numeral from 'numeral';

export async function updateLeaderboard(osuClient: OsuClient, sheetClient: SheetClient): Promise<void> {
  console.log('starting getting leaderboard');

  const leaderboardUsers: OsuLeaderboardUser[] = [];
  let cursor = { page: 1 };
  do {
    const response = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': cursor.page });
    if (!response) continue;

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
