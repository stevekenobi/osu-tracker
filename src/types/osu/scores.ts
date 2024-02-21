export type OsuScore = {
  score: {
    accuracy: number;
    score: number;
    max_combo: number;
    mode: string;
    mods: string[];
    pp: number;
    perfect: boolean;
    rank: string;
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
