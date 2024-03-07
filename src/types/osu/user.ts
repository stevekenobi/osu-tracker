export type OsuUser = {
  country_code: string;
  id: number;
  username: string;
  country: {
    code: string;
    name: string;
  };
  statistics: {
    count_ok: number;
    count_great: number;
    count_meh: number;
    count_miss: number;
    level: {
      current: number;
      progress: number;
    };
    global_rank: number;
    pp: number;
    ranked_score: number;
    hit_accuracy: number;
    play_count: number;
    play_time: number;
    total_score: number;
    total_hits: number;
    maximum_combo: number;
    grade_counts: {
      ss: number;
      ssh: number;
      s: number;
      sh: number;
      a: number;
    };
    country_rank: number;
  };
};
