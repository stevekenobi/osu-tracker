import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../../google_service_account.json';
import { JWT } from 'google-auth-library';
import type { SheetAge, SheetAgeStats, SheetBeatmap, SheetLeaderboard, SheetStats, SheetTarget } from '../types';
import type { AxiosError } from 'axios';
import { delay } from '../utils';
import type { SheetBeatmapPack } from '../types/sheets/packs';

export default class SheetClient {
  private readonly serviceAccountAuth;

  constructor(
    private readonly leaderboard_sheet_id: string,
    private readonly unfinished_sheet_id: string,
    private readonly beatmaps_sheet_id: string,
    private readonly ages_beatmaps_sheet_id: string,
  ) {
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
      return (await sheet.getRows<T>()).map((r) => Object.fromEntries(Object.entries(r.toObject()).filter(([_, v]) => v !== undefined)) as T);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.code === 'ERR_BAD_RESPONSE' || error.code === 'ERR_BAD_REQUEST') {
        console.log(`${error.code} at getting ${sheetTitle}`);
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
      if (error.code === 'ERR_BAD_RESPONSE' || error.code === 'ERR_BAD_REQUEST') {
        console.log(`${error.code} at adding in ${sheetTitle}`);
        await delay(10000);
        const response = await this.addRows<T>(rows, docId, sheetTitle);
        return response;
      }
      throw error;
    }
  }

  /* istanbul ignore next @preserve */
  private async clearRows(docId: string, sheetTitle: string, options?: { start?: number; end?: number }): Promise<void> {
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
      if (error.code === 'ERR_BAD_RESPONSE' || error.code === 'ERR_BAD_REQUEST') {
        console.log(`${error.code} at clearing in ${sheetTitle}`);
        await delay(10000);
        const response = await this.clearRows(docId, sheetTitle, options);
        return response;
      }
      throw error;
    }
  }

  /* istanbul ignore next @preserve */
  private async updateCell(docId: string, sheetTitle: string, cellByA1: string, value: string): Promise<void> {
    try {
      const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[sheetTitle];

      if (!sheet) {
        throw new Error(`Sheet ${sheetTitle} not found`);
      }

      await sheet.loadCells();

      const cell = sheet.getCellByA1(cellByA1);
      cell.value = value;

      await sheet.saveUpdatedCells();
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.code === 'ERR_BAD_RESPONSE' || error.code === 'ERR_BAD_REQUEST') {
        console.log(`${error.code} at updating cell ${cellByA1} in ${sheetTitle}`);
        await delay(10000);
        const response = await this.updateCell(docId, sheetTitle, cellByA1, value);
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
    const result = await this.getRows<SheetLeaderboard>(this.leaderboard_sheet_id, 'GR');
    return result;
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

  async updateOverallAccuracy(accuracy: string): Promise<void> {
    await this.updateCell(this.beatmaps_sheet_id, 'Stats', 'G28', accuracy);
  }

  async updateNoScoreBeatmaps(beatmaps: SheetBeatmap[]): Promise<void> {
    await this.updateUnfinishedBeatmaps(beatmaps, 'No Score');
  }

  async getNoScoreBeatmaps(): Promise<SheetBeatmap[]> {
    return this.getRows(this.unfinished_sheet_id, 'No Score');
  }

  async getUnfinishedBeatmaps(title: string): Promise<SheetBeatmap[]> {
    const result = await this.getRows<SheetBeatmap>(this.unfinished_sheet_id, title);
    return result;
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

  async updateArankBeatmaps(beatmaps: SheetBeatmap[]): Promise<void> {
    await this.updateUnfinishedBeatmaps(beatmaps, 'A Ranks');
  }

  async updateSuboptimalBeatmaps(beatmaps: SheetBeatmap[]): Promise<void> {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Sub Optimal');
  }

  private async updateUnfinishedBeatmaps(beatmaps: SheetBeatmap[], title: 'No Score' | 'Problematic' | 'Non SD' | 'DT' | 'A Ranks' | 'Sub Optimal'): Promise<void> {
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

  async updateAges(ages: SheetAge[], year: string): Promise<void> {
    await this.clearRows(this.ages_beatmaps_sheet_id, year, { start: 2 });
    await this.addRows(ages, this.ages_beatmaps_sheet_id, year);
  }

  async getAges(year: string): Promise<SheetAge[]> {
    const result = await this.getRows<SheetAge>(this.ages_beatmaps_sheet_id, year);
    return result;
  }

  async updateAgeStats(ages: SheetAgeStats[]): Promise<void> {
    await this.clearRows(this.ages_beatmaps_sheet_id, 'Ages');
    await this.addRows(ages, this.ages_beatmaps_sheet_id, 'Ages');
  }

  async getAgeStats(): Promise<SheetAgeStats[]> {
    const result = await this.getRows<SheetAgeStats>(this.ages_beatmaps_sheet_id, 'Ages');
    return result;
  }

  async updateBeatmapPackStats(stats: SheetBeatmapPack[]): Promise<void> {
    await this.clearRows(this.beatmaps_sheet_id, 'Packs');
    await this.addRows(stats, this.beatmaps_sheet_id, 'Packs');
  }
}
