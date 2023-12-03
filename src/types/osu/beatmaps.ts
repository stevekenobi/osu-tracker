import { RankStatus, Ruleset } from './enums';

export type BeatmapsetSearch = {
  beatmapsets: Beatmapset[];
  cursor_string: string;
};

export type Beatmapset = {
  id: number;
  artist: string;
  creator: string;
  status: RankStatus;
  title: string;
  bpm: number;
  ranked_date: string;
  beatmaps: Beatmap[];
};

export type Beatmap = {
  beatmapset_id: number;
  difficulty_rating: number;
  id: number;
  mode: Ruleset;
  status: RankStatus;
  version: string;
  accuracy: number;
  ar: number;
  bpm: number;
  cs: number;
  drain: number;
};
