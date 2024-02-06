import numeral from 'numeral';
import { OsuClient, SheetClient } from '../../client';
import { LeaderboardUser } from '@/types';

export async function updateLeaderboard(osuClient: OsuClient, sheetClient: SheetClient) {
  console.log('starting updating leaderboard');
  let leaderboard: LeaderboardUser[] = [];
  let i = 1;
  let leaderboardResponse = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': i.toString() });
  do {
    i++;
    if (!leaderboardResponse) {
      i--;
      continue;
    }

    leaderboard = leaderboard.concat(leaderboardResponse.ranking);
    leaderboardResponse = await osuClient.getCountryLeaderboard({ country: 'GR', 'cursor[page]': i.toString() });
  } while (leaderboardResponse?.cursor);

  leaderboard.sort((a, b) => (a.ranked_score < b.ranked_score ? 1 : -1));

  await sheetClient.updateLeaderboard(
    leaderboard.slice(0, 100).map((u, index) => ({
      '#': numeral(index + 1).format('0,0'),
      Link: `https://osu.ppy.sh/u/${u.user.id}`,
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
    })),
  );
  console.log('Updated leaderboard');
}
