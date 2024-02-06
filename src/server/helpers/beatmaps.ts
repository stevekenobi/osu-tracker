import { delay } from '../../utils';
import { OsuClient, SheetClient } from '../../client';
import { AppBeatmap, AppBeatmapset, Beatmapset, SheetBeatmap, UserPlayedBeatmaps } from '@/types';
import numeral from 'numeral';

export async function importLatestBeatmaps(osuClient: OsuClient, sheetClient: SheetClient) {
  const beatmapsetResult = await osuClient.getBeatmapsetSearch({});

  if (!beatmapsetResult)
    return {
      success: false,
      message: 'No recent beatmaps found',
    };

  const beatmapsets = beatmapsetResult.beatmapsets.filter((beatmapset) => beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved');

  const beatmaps = beatmapsets.flatMap((b) => createAppBeatmapsFromBeatmapset(b));

  await sheetClient.addBeatmaps(beatmaps);

  return {
    success: true,
    message: 'Recent beatmaps added successfully',
  };
}

export async function updateBeatmaps(sheetClient: SheetClient, osuClient: OsuClient) {
  let beatmaps: AppBeatmap[] = [];
  for (let i = 0; i < 3000000; i++) {
    const beatmapset = await osuClient.getBeatmapsetById(i);

    if (!beatmapset) {
      console.log(`Beatmapset ${i} not found`);
      continue;
    }

    console.log(`Beatmapset ${i} is ${beatmapset.status}`);
    beatmaps.push(...createAppBeatmapsFromBeatmapset(beatmapset));

    if (beatmaps.length > 20) {
      console.log(`Adding ${beatmaps.length} beatmaps`);
      await sheetClient.addBeatmaps(beatmaps);

      beatmaps = [];
    }
  }

  console.log('Background work finished');
}

export async function updateUnfinishedBeatmaps(sheetClient: SheetClient, osuClient: OsuClient) {
  console.log('starting updating unfinished beatmaps');
  const unfinished: UserPlayedBeatmaps[] = [];
  const problematic: UserPlayedBeatmaps[] = [];
  let j = 0;
  let playedResponse = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: '100', offset: j.toString() });
  do {
    j += 100;
    if (!playedResponse) {
      j -= 100;
      continue;
    }

    playedResponse
      .filter((b) => b.beatmap.mode === 'osu' && (b.beatmap.status === 'ranked' || b.beatmap.status === 'approved' || b.beatmap.status === 'loved'))
      .forEach(async (b) => {
        const score = await osuClient.getUserScoreOnBeatmap(b.beatmap_id, 12375044);
        if (!score) {
          unfinished.push(b);
        } else if (!score.score.perfect) {
          problematic.push(b);
        }
      });

    await delay(5000);

    playedResponse = await osuClient.getUserBeamaps(12375044, 'most_played', { limit: '100', offset: j.toString() });
  } while (playedResponse?.length !== 0);

  await sheetClient.updateUnfinishedBeatmaps(
    unfinished
      .sort((a, b) => (a.beatmap.difficulty_rating > b.beatmap.difficulty_rating ? 1 : -1))
      .map((b) => ({
        Link: `https://osu.ppy.sh/b/${b.beatmap_id}`,
        Artist: b.beatmapset.artist,
        Title: b.beatmapset.title,
        Creator: b.beatmapset.creator,
        Version: b.beatmap.version,
        Difficulty: b.beatmap.difficulty_rating.toString(),
        Status: b.beatmap.status,
        Playcount: numeral(b.count).format('0,0'),
      })),
  );

  await sheetClient.updateProblematicBeatmaps(
    problematic
      .sort((a, b) => (a.beatmap.difficulty_rating > b.beatmap.difficulty_rating ? 1 : -1))
      .map((b) => ({
        Link: `https://osu.ppy.sh/b/${b.beatmap_id}`,
        Artist: b.beatmapset.artist,
        Title: b.beatmapset.title,
        Creator: b.beatmapset.creator,
        Version: b.beatmap.version,
        Difficulty: b.beatmap.difficulty_rating.toString(),
        Status: b.beatmap.status,
        Playcount: numeral(b.count).format('0,0'),
      })),
  );
  console.log('Unfinished Beatmaps Updated');
}

export function createAppBeatmapsFromBeatmapset(beatmapset: Beatmapset): AppBeatmap[] {
  return beatmapset.beatmaps
    .filter((b) => b.mode === 'osu')
    .filter((b) => b.status === 'approved' || b.status === 'loved' || b.status === 'ranked')
    .sort((a, b) => (a.difficulty_rating > b.difficulty_rating ? 1 : -1))
    .map((b) => ({
      id: b.id,
      artist: beatmapset.artist,
      title: beatmapset.title,
      creator: beatmapset.creator,
      beatmapset_id: beatmapset.id,
      ar: b.ar,
      bpm: b.bpm,
      cs: b.cs,
      hp: b.drain,
      length: b.hit_length,
      difficulty_rating: b.difficulty_rating,
      link: `https://osu.ppy.sh/b/${b.id}`,
      od: b.accuracy,
      ranked_date: new Date(beatmapset.ranked_date),
      status: b.status,
      version: b.version,
    }));
}

export function createAppBeatmapsetFromAppBeatmaps(beatmaps: Partial<SheetBeatmap>[]): AppBeatmapset[] {
  const result: AppBeatmapset[] = [];
  const ids = new Set(beatmaps.flatMap((b) => b.BeatmapsetId));
  ids.forEach((id) => {
    const maps = beatmaps.filter((m) => m.BeatmapsetId === id);

    result.push({
      id: Number.parseInt(id ?? '-1'),
      link: `https://osu.ppy.sh/beatmapsets/${id}`,
      artist: maps[0].Artist ?? '',
      title: maps[0].Title ?? '',
      creator: maps[0].Creator ?? '',
      status: maps[0].Status ?? 'unknown',
      beatmaps: maps
        .sort((a, b) => ((a.Difficulty ?? 0) > (b.Difficulty ?? 0) ? 1 : -1))
        .map((m) => ({
          id: Number.parseInt(m.Link?.split('/').at(-1) ?? '0'),
          link: m.Link ?? '',
          bpm: Number.parseFloat(m.BPM ?? '-1'),
          hp: Number.parseFloat(m.HP ?? '-1'),
          ar: Number.parseFloat(m.AR ?? '-1'),
          cs: Number.parseFloat(m.CS ?? '-1'),
          od: Number.parseFloat(m.OD ?? '-1'),
          artist: m.Artist ?? '',
          title: m.Title ?? '',
          creator: m.Creator ?? '',
          version: m.Version ?? '',
          status: m.Status ?? 'unknown',
          difficulty_rating: Number.parseFloat(m.Difficulty ?? '-1'),
          length: Number.parseInt(m.Length ?? '-1'),
          ranked_date: new Date(m.Date ?? ''),
          beatmapset_id: Number.parseInt(m.BeatmapsetId ?? '-1'),
        })),
      ranked_date: new Date(maps[0].Date ?? ''),
    });
  });
  return result.sort((a, b) => (a.ranked_date < b.ranked_date ? 1 : -1));
}
