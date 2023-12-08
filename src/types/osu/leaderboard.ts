export type LeaderboardSearch = {
  cursor?: {
    page: number;
  };
  ranking: LeaderboardUser[];
};

export type LeaderboardUser = {
  count_100: number;
  count_300: number;
  count_50: number;
  count_miss: number;
  level: {
    current: number;
    progress: number;
  };
  global_rank: number;
  pp: number;
  pp_exp: number;
  ranked_score: number;
  hit_accuracy: number;
  play_count: number;
  play_time: number;
  total_score: number;
  total_hits: number;
  maximum_combo: number;
  replays_watched_by_others: number;
  grade_counts: {
    ss: number;
    ssh: number;
    s: number;
    sh: number;
    a: number;
  };
  user: {
    country_code: string;
    id: number;
    username: string;
  };
};
