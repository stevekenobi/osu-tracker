import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../../google_service_account.json';
import { JWT } from 'google-auth-library';
import type { SheetBeatmap, SheetLeaderboard, SheetNoScoreBeatmap, SheetStats, SheetTarget } from '../types';
import type { AxiosError } from 'axios';
import { delay } from '../utils';

export default class SheetClient {
  private readonly serviceAccountAuth;

  constructor(private readonly leaderboard_sheet_id: string, private readonly unfinished_sheet_id: string, private readonly beatmaps_sheet_id: string, private readonly missing_beatmaps_sheet_id: string) {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
    this.serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });
  }

  /* istanbul ignore next @preserve */
  private async getRows<T extends Record<string, string | number>>(docId: string, sheetTitle: string): Promise<T[]> {
    try {
      const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[sheetTitle];

      if (!sheet) {
        throw new Error(`Sheet ${sheetTitle} not found`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return (await sheet.getRows<T>()).map(r => Object.fromEntries(Object.entries(r.toObject()).filter(([_, v]) => v !== undefined)) as T);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.code === 'ERR_BAD_RESPONSE') {
        console.log(`ERR_BAD_RESPONSE at getting ${sheetTitle}`);
        await delay(10000);
        const response = await this.getRows<T>(docId, sheetTitle);
        return response;
      }
      throw error;
    }
  }

  /* istanbul ignore next @preserve */
  private async addRows<T extends Record<string, string | number>>(rows: T[], docId: string, sheetTitle: string): Promise<void> {
    try {
      const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[sheetTitle];

      if (!sheet) {
        throw new Error(`Sheet ${sheetTitle} not found`);
      }

      await sheet.addRows(rows);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.code === 'ERR_BAD_RESPONSE') {
        console.log(`ERR_BAD_RESPONSE at adding in ${sheetTitle}`);
        await delay(10000);
        const response = await this.addRows<T>(rows, docId, sheetTitle);
        return response;
      }
      throw error;
    }
  }

  /* istanbul ignore next @preserve */
  private async clearRows(docId: string, sheetTitle: string, options?: { start?: number, end?: number }): Promise<void> {
    try {
      const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[sheetTitle];

      if (!sheet) {
        throw new Error(`Sheet ${sheetTitle} not found`);
      }

      await sheet.clearRows(options);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.code === 'ERR_BAD_RESPONSE') {
        console.log(`ERR_BAD_RESPONSE at adding in ${sheetTitle}`);
        await delay(10000);
        const response = await this.clearRows(docId, sheetTitle, options);
        return response;
      }
      throw error;
    }
  }

  async updateLeaderboard(users: SheetLeaderboard[]): Promise<void> {
    await this.clearRows(this.leaderboard_sheet_id, 'GR', { start: 2 });
    await this.addRows(users, this.leaderboard_sheet_id, 'GR');
  }

  async getLeaderboard(): Promise<SheetLeaderboard[]> {
    return this.getRows(this.leaderboard_sheet_id, 'GR');
  }

  async updateBeatmapsOfYear(year: string, beatmaps: SheetBeatmap[]): Promise<void> {
    await this.clearRows(this.beatmaps_sheet_id, year, { start: 2 });
    await this.addRows(beatmaps, this.beatmaps_sheet_id, year);
  }

  async getBeatmapsOfYear(year: string): Promise<SheetBeatmap[]> {
    return this.getRows(this.beatmaps_sheet_id, year);
  }

  async updateStats(stats: SheetStats[]): Promise<void> {
    await this.clearRows(this.beatmaps_sheet_id, 'Stats', { start: 2, end: 22 });
    await this.addRows(stats, this.beatmaps_sheet_id, 'Stats');
  }

  async getStats(): Promise<SheetStats[]> {
    return this.getRows(this.beatmaps_sheet_id, 'Stats');
  }

  async updateMissingBeatmaps(ids: number[]): Promise<void> {
    await this.addRows(ids.map(i => ({ Id: i })), this.missing_beatmaps_sheet_id, 'Missing');
  }

  async clearMissingBeatmaps(): Promise<void> {
    await this.clearRows(this.missing_beatmaps_sheet_id, 'Missing', { start: 2 });
  }

  async getMissingBeatmaps(): Promise<string[]> {
    return (await this.getRows<{ Id: string }>(this.missing_beatmaps_sheet_id, 'Missing')).map(x => x.Id);
  }

  async updateNoScoreBeatmaps(beatmaps: SheetNoScoreBeatmap[]): Promise<void> {
    await this.clearRows(this.unfinished_sheet_id, 'No Score', { start: 2 });
    await this.addRows(beatmaps, this.unfinished_sheet_id, 'No Score');
  }

  async getNoScoreBeatmaps(): Promise<SheetNoScoreBeatmap[]> {
    return this.getRows(this.unfinished_sheet_id, 'No Score');
  }

  async getUnfinishedBeatmaps(title: string): Promise<SheetBeatmap[]> {
    return this.getRows(this.unfinished_sheet_id, title);
  }

  async updateProblematicBeatmaps(beatmaps: SheetBeatmap[]): Promise<void> {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Problematic');
  }

  async updateNonSDBeatmaps(beatmaps: SheetBeatmap[]): Promise<void> {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Non SD');
  }

  async updateDtBeatmaps(beatmaps: SheetBeatmap[]): Promise<void> {
    await this.updateUnfinishedBeatmaps(beatmaps, 'DT');
  }

  private async updateUnfinishedBeatmaps(beatmaps: SheetBeatmap[], title: string): Promise<void> {
    await this.clearRows(this.unfinished_sheet_id, title, { start: 2 });
    await this.addRows(beatmaps, this.unfinished_sheet_id, title);
  }

  async updateTargets(targets: SheetTarget[]): Promise<void> {
    await this.clearRows(this.leaderboard_sheet_id, 'Targets');
    await this.addRows(targets, this.leaderboard_sheet_id, 'Targets');
  }

  async getTargets(): Promise<SheetTarget[]> {
    const response = await this.getRows<SheetTarget>(this.leaderboard_sheet_id, 'Targets');
    return response;
  }
}
