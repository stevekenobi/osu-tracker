export type SheetBeatmap = {
  Link: string;
  Artist: string;
  Title: string;
  Creator: string;
  Version: string;
  Difficulty: string;
  Status: string;
  BPM: string;
  AR: string;
  CS: string;
  HP: string;
  OD: string;
  Length: string;
  Rank?: string;
  Mods?: string;
  Accuracy?: string;
  Score?: string;
};

export type SheetNoScoreBeatmap = {
  Link: string
  Artist: string
  Title: string
  Creator: string
  Version: string
  Difficulty: string
  Status: string
  Length: string
  Playcount: string
};
