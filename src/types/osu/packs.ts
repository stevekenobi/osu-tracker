export type OsuBeatmapPacksResponse = {
  beatmap_packs: OsuBeatmapPack[];
  cursor: {
    pack_id: number;
  };
  cursor_string: string;
};

export type OsuBeatmapPack = {
  author: string;
  date: string;
  name: string;
  no_diff_reduction: boolean;
  ruleset_id: number;
  tag: string;
  url: string;
};
