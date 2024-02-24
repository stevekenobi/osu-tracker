import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../../google_service_account.json';
import { JWT } from 'google-auth-library';
import type { SheetBeatmap, SheetLeaderboard, SheetNoScoreBeatmap, SheetStats } from '../types';

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

  async updateLeaderboard(users: SheetLeaderboard[]): Promise<void> {
    const doc = new GoogleSpreadsheet(this.leaderboard_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['GR'];

    if (!sheet) throw new Error('sheet GR not found in Leaderboard');

    await sheet.clearRows({ start: 2 });
    await sheet.addRows(
      users,
      { raw: true },
    );
  }

  async getLeaderboard(): Promise<SheetLeaderboard[]> {
    const doc = new GoogleSpreadsheet(this.leaderboard_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['GR'];
    if (!sheet) throw new Error('sheet GR not found in Leaderboard');

    return (await sheet.getRows<SheetLeaderboard>()).map(r => r.toObject() as SheetLeaderboard);
  }

  async updateBeatmapsOfYear(year: string, beatmaps: SheetBeatmap[]): Promise<void> {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[year];

    if (!sheet) throw new Error(`sheet ${year} not found in beatmaps`);

    await sheet.clearRows({ start: 2 });
    await sheet.addRows(beatmaps);
  }

  async getBeatmapsOfYear(year: string): Promise<SheetBeatmap[]> {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[year];

    if (!sheet) throw new Error(`sheet ${year} not found in beatmaps`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (await sheet.getRows<SheetBeatmap>()).map(r => Object.fromEntries(Object.entries(r.toObject()).filter(([_, v]) => v != undefined)) as SheetBeatmap);
  }

  async updateStats(stats: SheetStats[]): Promise<void> {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Stats'];
    if (!sheet) throw new Error('sheet Stats not found in beatmaps');

    await sheet.clearRows({ start: 2, end: 22 });

    await sheet.addRows(stats);
  }

  async updateMissingBeatmaps(ids: number[]): Promise<void> {
    const doc = new GoogleSpreadsheet(this.missing_beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];
    if (!sheet) throw new Error('sheet Missing not found in beatmaps');
    await sheet.addRows(ids.map((i) => ({ Id: i })));
  }

  async clearMissingBeatmaps(): Promise<void> {
    const doc = new GoogleSpreadsheet(this.missing_beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];
    if (!sheet) throw new Error('sheet Missing not found in beatmaps');
    await sheet.clearRows({ start: 2 });
  }

  async getMissingBeatmaps(): Promise<string[]> {
    const doc = new GoogleSpreadsheet(this.missing_beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];
    if (!sheet) throw new Error('sheet Missing not found in beatmaps');

    return (await sheet.getRows<{ Id: string }>()).map((r) => (r.toObject() as { Id: string }).Id);
  }

  async updateNoScoreBeatmaps(beatmaps: SheetNoScoreBeatmap[]): Promise<void> {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['No Score'];
    if (!sheet) throw new Error('sheet No Score not found in unfinished');

    await sheet.clearRows({ start: 2 });
    await sheet.addRows(beatmaps);
  }

  async getNoScoreBeatmaps(): Promise<SheetNoScoreBeatmap[]> {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['No Score'];
    if (!sheet) throw new Error('sheet No Score not found in unfinished');

    return (await sheet.getRows()).map((r) => r.toObject() as SheetNoScoreBeatmap);
  }

  async getUnfinishedBeatmaps(title: string): Promise<SheetBeatmap[]> {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[title];
    if (!sheet) throw new Error(`sheet ${title} not found in unfinished`);

    return (await sheet.getRows<SheetBeatmap>()).map((r) => r.toObject() as SheetBeatmap);
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
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[title];
    if (!sheet) throw new Error(`sheet ${title} not found in unfinished`);

    await sheet.clearRows({ start: 2 });

    await sheet.addRows(beatmaps);
  }
}
