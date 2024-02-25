export type AppBeatmap = {
  id: number;
  beatmapsetId: number;
  artist: string;
  title: string;
  creator: string;
  version: string;
  difficulty: number;
  AR: number;
  CS: number;
  OD: number;
  HP: number;
  BPM: number;
  length: number;
  mode: string;
  status: string;
  rankedDate: string;
  accuracy?: number | null;
  max_combo?: number | null;
  mods?: string | null;
  perfect?: boolean | null;
  pp?: number | null;
  rank?: string | null;
  score?: number | null;
  count_100?: number | null;
  count_300?: number | null;
  count_50?: number | null;
  count_miss?: number | null;
};

export type AppBeatmapset = {
  id: number;
  beatmaps: AppBeatmap[];
};

export type AppScore = {
  id: number
  accuracy: number
  max_combo: number
  mode: string
  mods: string
  perfect: boolean
  pp: number
  rank: string
  score: number
  count_100: number
  count_300: number
  count_50: number
  count_miss: number
};
