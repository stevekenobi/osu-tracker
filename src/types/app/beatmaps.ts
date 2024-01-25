import { RankStatus } from '../osu/enums';
import { AppScore } from './scores';

export type AppBeatmapset = {
  id: number;
  artist: string;
  title: string;
  link: string;
  creator: string;
  date: Date;
  status: RankStatus;
  beatmaps: AppBeatmap[];
};

export type AppBeatmap = {
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
  ranked_date: string;
  beatmapset_id: number;
  score?: AppScore;
};
