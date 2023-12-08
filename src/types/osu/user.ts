export type User = {
  id: number;
  username: string;
  country_code: string;
  beatmap_playcounts_count: number;
  statistics: {
    count_100: number;
    count_300: number;
    count_50: number;
    count_miss: number;
    level: {
      current: number;
      progress: number;
    };
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
  };
};
