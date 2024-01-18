import type { Request, Response } from 'express';

import AbstractService from '../AbstractService';
import Server from '../server';
import { AppBeatmap, AppBeatmapset } from '@/types';
import { updateBeatmaps } from '../helpers/beatmaps';

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
    this.app.get('/api/beatmaps/unfinished', this._getUnfinishedBeatmapsRequestHandler.bind(this));
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
    updateBeatmaps(this.osuClient, this.sheetClient);
    res.status(200).json({
      meta: {
        status: 200,
      },
      data: 'Job started',
    });
  }

  private async _getUnfinishedBeatmapsRequestHandler(req: Request, res: Response): Promise<void> {
    const result = await this.databaseClient.getUnfinishedBeatmaps();

    res.status(200).json({
      meta: {
        status: 200,
      },
      data: result,
    });
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
