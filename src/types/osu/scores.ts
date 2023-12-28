import { Beatmap } from './beatmaps';
import { PlayMods, ScoreRank } from './enums';

export type UserScore = {
  position: number;
  score: {
    accuracy: number;
    best_id: number;
    created_at: string;
    id: number;
    max_combo: number;
    mode: string;
    mods: PlayMods[];
    passed: boolean;
    perfect: boolean;
    pp: number;
    rank: ScoreRank;
    replay: boolean;
    score: number;
    statistics: {
      count_100: number;
      count_300: number;
      count_50: number;
      count_geki: number;
      count_katu: number;
      count_miss: number;
    };
    beatmap: Beatmap;
  };
};
