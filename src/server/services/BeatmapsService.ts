import type { Request, Response } from 'express';

import { OsuClient, SheetClient } from '@/client';
import AbstractService from '../AbstractService';
import Server from '../server';
import { AppBeatmap, AppBeatmapset, Beatmapset } from '@/types';
import { AxiosError } from 'axios';
import { delay } from '../../utils';

export default class BeatmapsService extends AbstractService {
  constructor(serverInstance: Server) {
    super(serverInstance);
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/beatmaps', this._getBeatmapListRequestHandler.bind(this));
    this.app.get('/api/beatmaps/sets/:year', this._getYearBeatmapsetsRequestHandler.bind(this));
    this.app.post('/api/beatmaps', this._postBeatmapUpdateRequestHandler.bind(this));
  }

  private async _getBeatmapListRequestHandler(req: Request, res: Response): Promise<void> {
    const response = await this.sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', '2007');
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _getYearBeatmapsetsRequestHandler(req: Request, res: Response) {
    const beatmaps = await this.sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', req.params.year);
    const response = groupBeatmapsBySet(beatmaps as AppBeatmap[]);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: response,
    });
  }

  private async _postBeatmapUpdateRequestHandler(req: Request, res: Response): Promise<void> {
    const osuClient = this.osuClient;
    const sheetClient = this.sheetClient;

    async function updateBeatmaps() {
      let years: {
        [key: string]: AppBeatmap[];
      } = {};
      let cursor_string = '';
      do {
        const beatmapsetResult = await osuClient.getBeatmapsetSearch(cursor_string === '' ? {} : { cursor_string });

        if (!beatmapsetResult) break;

        const beatmapsets = beatmapsetResult.beatmapsets.filter((beatmapset) => beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved');
        cursor_string = beatmapsetResult.cursor_string;

        beatmapsets.forEach((b) => {
          const beatmaps = createAppBeatmapsFromBeatmapset(b);
          if (years[b.ranked_date.substring(0, 4)]) {
            years[b.ranked_date.substring(0, 4)].push(...beatmaps);
          } else {
            years[b.ranked_date.substring(0, 4)] = beatmaps;
          }
        });

        for (const year of Object.keys(years)) {
          if (years[year].length === 0) continue;

          await addRowsToSheet(sheetClient, years, year);
        }

        years = {};
      } while (cursor_string);

      console.log('Background work finished');
    }

    updateBeatmaps();
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }
}

async function addRowsToSheet(
  sheetClient: SheetClient,
  years: {
    [key: string]: AppBeatmap[];
  },
  year: string,
) {
  try {
    const beatmapsFromSheet = await sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year);
    const beatmapsToAdd = years[year].filter((b) => !beatmapsFromSheet.some((x) => x.Link === b.Link));

    if (beatmapsToAdd.length === 0) return;
    await sheetClient.addRows('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year, beatmapsToAdd);

    console.log(`Added ${beatmapsToAdd.length} new beatmaps in ${year}`);
  } catch (err: unknown) {
    const error = err as AxiosError;
    if (error.response?.status === 429) {
      console.log(error.response.status);
      await delay(10000);

      await addRowsToSheet(sheetClient, years, year);
    }
  }
}

function groupBeatmapsBySet(beatmaps: AppBeatmap[]): AppBeatmapset[] {
  const result: AppBeatmapset[] = [];
  const ids = new Set(beatmaps.flatMap((b) => b.BeatmapsetId));
  ids.forEach((id) => {
    const maps = beatmaps.filter((m) => m.BeatmapsetId === id);
    const set = {
      id,
      link: `https://osu.ppy.sh/beatmapsets/${id}`,
      artist: maps[0].Artist,
      title: maps[0].Title,
      creator: maps[0].Creator,
      status: maps[0].Status,
      beatmaps: maps.sort((a, b) => (a.Difficulty > b.Difficulty ? 1 : -1)),
      date: new Date(maps[0].Date),
    };

    result.push(set);
  });
  return result.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function createAppBeatmapsFromBeatmapset(beatmapset: Beatmapset): AppBeatmap[] {
  return beatmapset.beatmaps
    .filter((b) => b.mode === 'osu')
    .map((b) => ({
      Link: `https://osu.ppy.sh/beatmaps/${b.id}`,
      Artist: beatmapset.artist,
      Title: beatmapset.title,
      Creator: beatmapset.creator,
      Version: b.version,
      Status: b.status,
      Difficulty: b.difficulty_rating,
      BPM: b.bpm,
      AR: b.ar,
      CS: b.cs,
      HP: b.drain,
      OD: b.accuracy,
      Date: beatmapset.ranked_date,
      BeatmapsetId: beatmapset.id.toString(),
    }));
}