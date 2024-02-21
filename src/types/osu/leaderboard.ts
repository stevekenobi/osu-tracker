export type OsuLeaderboardQuery = {
  country: string;
  'cursor[page]': number
};

export type OsuLeaderboardResponse = {
  cursor: {
    page: number
  },
  ranking: OsuLeaderboardUser[];
};

export type OsuLeaderboardUser = {
  ranked_score: number,
  hit_accuracy: number,
  play_count: number,
  total_score: number,
  grade_counts: {
    ss: number,
    ssh: number,
    s: number,
    sh: number,
    a: number
  },
  user: {
    id: number,
    username: string,
  }
};
