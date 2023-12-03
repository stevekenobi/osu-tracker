import { RankStatus } from '../osu/enums';

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
};
