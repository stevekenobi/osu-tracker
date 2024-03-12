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
  checksum: string;
  status: string;
  rankedDate: string;
  submittedDate: string;
  unfinished?: boolean;
  accuracy?: number | null;
  max_combo?: number | null;
  mods?: string | null;
  perfect?: boolean | null;
  pp?: number | null;
  rank?: string | null;
  score?: number | null;
  count_ok?: number | null;
  count_great?: number | null;
  count_meh?: number | null;
  count_miss?: number | null;
};

export type AppBeatmapset = {
  id: number;
  beatmaps: AppBeatmap[];
  rankedDate: string;
  submittedDate: string;
};

export type AppScore = {
  id: number;
  unfinished: boolean;
  accuracy: number;
  max_combo: number;
  mode: string;
  mods: string;
  perfect: boolean;
  pp: number;
  rank: string;
  score: number;
  count_ok: number;
  count_great: number;
  count_meh: number;
  count_miss: number;
};
