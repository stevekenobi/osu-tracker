import type { OsuBeatmap, OsuBeatmapset } from './beatmaps';

export type OsuScore = {
  score: {
    id: number;
    mods: {
      acronym: string,
      settings: {
        speed_change: string
      }
    }[]
    statistics: {
      ok: number
      great: number
      ignore_hit: number
      ignore_miss: number
      large_bonus: number
      small_bonus: number
      large_tick_hit: number
      slider_tail_hit: number
    },
    ruleset_id: number
    ended_at: string
    rank: string,
    accuracy: number,
    is_perfect_combo: boolean,
    max_combo: number,
    pp: number | null,
    total_score: number,
    beatmap: {
      beatmapset_id: number,
      id: number,
    },
    user_id: number;
  }
};

export type OsuRecentScore = {
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
  beatmap: OsuBeatmap;
  beatmapset: OsuBeatmapset;
};
