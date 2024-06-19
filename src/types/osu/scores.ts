import type { OsuBeatmap, OsuBeatmapset } from './beatmaps';

export type OsuUserScore = {
  score: OsuScore;
};

export type OsuScore = {
  id: number;
  mods: OsuMod[];
  statistics: {
    ok?: number;
    great?: number;
    meh?: number;
    miss?: number;
    ignore_hit: number;
    ignore_miss: number;
    large_bonus: number;
    small_bonus: number;
    large_tick_hit: number;
    slider_tail_hit: number;
  };
  ruleset_id: number;
  ended_at: string;
  rank: string;
  accuracy: number;
  is_perfect_combo: boolean;
  max_combo: number;
  pp: number;
  total_score: number;
  user_id: number;
  beatmap: OsuBeatmap;
  beatmapset: OsuBeatmapset;
};

export type OsuMod = {
  acronym: string;
  settings?: {
    [key: string]: number | string;
  };
};
