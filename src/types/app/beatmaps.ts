import { RankStatus } from '../osu/enums';

export type AppBeatmapset = {
  id: number;
  artist: string;
  title: string;
  link: string;
  creator: string;
  ranked_date: Date;
  status: RankStatus;
  beatmaps: AppBeatmap[];
};

export type AppBeatmap = {
  id: number;
  link: string;
  artist: string;
  title: string;
  creator: string;
  version: string;
  status: RankStatus;
  difficulty_rating: number;
  bpm: number;
  ar: number;
  cs: number;
  hp: number;
  od: number;
  length: number;
  ranked_date: Date;
  beatmapset_id: number;
};

export type AppUnfinishedBeatmap = {
  beatmap_id: string;
  play_count: number;
  Beatmap: AppBeatmap;
};
