export type OsuBeatmapsetSearchResponse = {
  beatmapsets: OsuBeatmapset[];
  cursor_string: string;
};

export type OsuBeatmapset = {
  id: number;
  artist: string;
  title: string;
  creator: string;
  ranked_date: string;
  beatmaps: OsuBeatmap[];
  bpm: number;
  status: string;
};

export type OsuBeatmap = {
  id: number;
  version: string;
  difficulty_rating: number;
  beatmapset_id: number;
  ar: number;
  cs: number,
  accuracy: number,
  drain: number,
  bpm: number,
  total_length: number,
  user_id: number;
  mode: string,
  status: string,
  beatmapset: OsuBeatmapset;
  checksum: string;
};

export type OsuUserBeatmap = {
  beatmap_id: number;
  count: number;
  beatmap: {
    status: string;
    mode: string;
    version: string;
    difficulty_rating: number;
    total_length: number;
  }
  beatmapset: {
    id: number;
    artist: string;
    title: string;
    creator: string;
  }
};
