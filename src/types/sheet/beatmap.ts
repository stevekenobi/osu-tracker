import { RankStatus, ScoreRank } from '../osu/enums';

export type SheetBeatmap = {
  Link: string;
  Artist: string;
  Title: string;
  Creator: string;
  Version: string;
  Difficulty: string;
  Status: RankStatus;
  BPM: string;
  AR: string;
  CS: string;
  HP: string;
  OD: string;
  Length: string;
  Date: string;
  BeatmapsetId: string;
  Rank: ScoreRank;
  Mods: string;
  Accuracy: string;
  Score: string;
};

export type SheetUnfinishedBeatmaps = {
  Link: string;
  Artist: string;
  Title: string;
  Creator: string;
  Version: string;
  Difficulty: string;
  Status: RankStatus;
  Playcount: string;
};
