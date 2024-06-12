import type { OsuBeatmapPack } from '../../types';
import TrackerServer from '../server';

export async function getOsuBeatmapPacks(): Promise<OsuBeatmapPack[] | undefined> {
  const response = await TrackerServer.getOsuClient().getOsuBeatmapPacks();
  return response?.beatmap_packs;
}
