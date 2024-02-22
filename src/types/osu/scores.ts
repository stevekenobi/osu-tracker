export type OsuScore = {
  score: {
    id: number;
    accuracy: number;
    score: number;
    max_combo: number;
    mode: string;
    mods: string[];
    pp: number;
    perfect: boolean;
    rank: string;
    created_at: string;
    user_id: number;
    statistics: {
      count_100: number,
      count_300: number,
      count_50: number,
      count_miss: number
    },
    beatmap: {
      id: number
      beatmapset_id: number;
    }
  }
};
