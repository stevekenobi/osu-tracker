import { RankStatus } from '../osu/enums';

export type AppBeatmapset = {
  id: string;
  artist: string;
  title: string;
  link: string;
  creator: string;
  date: Date;
  status: RankStatus;
  beatmaps: AppBeatmap[];
};

export type AppBeatmap = {
  Link: string;
  Artist: string;
  Title: string;
  Creator: string;
  Version: string;
  Status: RankStatus;
  Difficulty: number;
  BPM: number;
  AR: number;
  CS: number;
  HP: number;
  OD: number;
  Date: string;
  BeatmapsetId: string;
};
