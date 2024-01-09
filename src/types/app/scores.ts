import { AppBeatmap, AppBeatmapset } from './beatmaps';

export type AppBeatmapsetScore = Omit<AppBeatmapset, 'beatmaps'> & { beatmaps: AppBeatmapScore[] };

export type AppBeatmapScore = {
  beatmap: AppBeatmap;
  score?: AppScore;
};

export type AppScore = {
  accuracy: number;
  created_at: string;
  id: number;
  max_combo: number;
  mode: string;
  mods: string;
  perfect: boolean;
  pp: number;
  rank: string;
  score: number;
  count_100: number;
  count_300: number;
  count_50: number;
  count_geki: number;
  count_katu: number;
  count_miss: number;
};
