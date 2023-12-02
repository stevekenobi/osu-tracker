import type { Request, Response } from 'express';

import { OsuClient, SheetClient } from '@/client';
import AbstractService from '../AbstractService';
import Server from '../server';
import { AppBeatmap, Beatmapset } from '@/types';
import { range } from '../../utils';

export default class BeatmapsService extends AbstractService {
  private osuClient: OsuClient;
  private sheetClient: SheetClient;

  constructor(serverInstance: Server) {
    super(serverInstance);
    this.osuClient = serverInstance.getOsuClient();
    this.sheetClient = serverInstance.getSheetClient();
  }

  override init(): void {
    /* empty */
  }
  override shutDown(): void {
    /* empty */
  }

  override registerRoutes(): void {
    this.app.get('/api/beatmaps', this._getBeatmapListRequestHandler.bind(this));
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

  private async _postBeatmapUpdateRequestHandler(req: Request, res: Response): Promise<void> {
    const osuClient = this.osuClient;
    const sheetClient = this.sheetClient;

    async function updateBeatmaps() {
      let years: {
        [key: string]: AppBeatmap[];
      } = {};
      console.log(req.body);
      for (const i of range(parseInt(req.body.start), parseInt(req.body.end))) {
        const beatmapset = await osuClient.getBeatmapsetById(i);
        if (!beatmapset) {
          console.log(`${i} not found`);
          continue;
        }
        console.log(`${i} is ${beatmapset.status}`);

        if (beatmapset.status === 'ranked' || beatmapset.status === 'approved' || beatmapset.status === 'loved') {
          const beatmaps = createAppBeatmapsFromBeatmapset(beatmapset);
          if (years[beatmapset.ranked_date.substring(0, 4)]) {
            years[beatmapset.ranked_date.substring(0, 4)].push(...beatmaps);
          } else {
            years[beatmapset.ranked_date.substring(0, 4)] = beatmaps;
          }
        }

        if (i % 100 === 0) {
          for (const year of Object.keys(years)) {
            const beatmapsFromSheet = await sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year);
            const beatmapsToAdd = years[year].filter((b) => !beatmapsFromSheet.some((x) => x.Link === b.Link));
            await sheetClient.addRows('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year, beatmapsToAdd);

            console.log(`Added ${beatmapsToAdd.length} new beatmaps in ${year}`);
          }

          years = {};
        }
      }

      for (const year of Object.keys(years)) {
        const beatmapsFromSheet = await sheetClient.getRows<AppBeatmap>('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year);
        const beatmapsToAdd = years[year].filter((b) => !beatmapsFromSheet.some((x) => x.Link === b.Link));
        await sheetClient.addRows('19yENPaqMxN41X7bU9QpAylYc3RZfctt9a1oVE6lUqI0', year, beatmapsToAdd);
      }
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

function createAppBeatmapsFromBeatmapset(beatmapset: Beatmapset): AppBeatmap[] {
  return beatmapset.beatmaps.map((b) => ({
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
  }));
}
