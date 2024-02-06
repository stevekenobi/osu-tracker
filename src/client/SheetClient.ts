import { AppBeatmap, SheetBeatmap, SheetLeaderboardUser, SheetUnfinishedBeatmaps, UserScore } from '@/types';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../../google_service_account.json';
import { JWT } from 'google-auth-library';
import { AxiosError } from 'axios';
import { delay } from '../utils';
import numeral from 'numeral';

export class SheetClient {
  private readonly serviceAccountAuth: JWT;

  constructor(
    private readonly leaderboard_sheet_id: string,
    private readonly unfinished_sheet_id: string,
    private readonly beatmaps_sheet_id: string,
  ) {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
    this.serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });
  }

  public async readLeaderboard(): Promise<Partial<SheetLeaderboardUser>[]> {
    try {
      const doc = new GoogleSpreadsheet(this.leaderboard_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];

      const rows = await sheet.getRows<SheetLeaderboardUser>();

      return rows.map((r) => r.toObject());
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        return await this.readLeaderboard();
      }
      return [];
    }
  }

  public async updateLeaderboard(users: SheetLeaderboardUser[]) {
    try {
      const doc = new GoogleSpreadsheet(this.leaderboard_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];
      await sheet.clearRows({ start: 2 });
      await sheet.addRows(users);
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.log('some error occured');
      if (error.response?.status === 429) {
        await delay(30000);
        await this.updateLeaderboard(users);
      }
    }
  }

  public async updateBeatmaps(beatmaps: AppBeatmap[], year: string) {
    try {
      const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[year];

      await sheet.addRows(
        beatmaps.map((b) => ({
          Link: `https://osu.ppy.sh/b/${b.id}`,
          Artist: b.artist,
          Title: b.title,
          Creator: b.creator,
          Version: b.version,
          Difficulty: b.difficulty_rating,
          Status: b.status,
          BPM: b.bpm,
          AR: b.ar,
          CS: b.cs,
          HP: b.hp,
          OD: b.od,
          Length: b.length,
        })),
      );
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        await this.updateBeatmaps(beatmaps, year);
      }
    }
  }

  public async addBeatmaps(beatmaps: AppBeatmap[]) {
    try {
      const years = Array.from(new Set(beatmaps.flatMap((b) => b.ranked_date.getFullYear())));
      console.log(years);
      for (const year of years) {
        const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByTitle[year.toString()];

        const rows = await sheet.getRows<SheetBeatmap>();

        await this.updateBeatmaps(
          beatmaps.filter((b) => b.ranked_date.getFullYear() === year && !rows.map((r) => r.get('Link')).includes(`https://osu.ppy.sh/b/${b.id}`)),
          year.toString(),
        );
      }
    } catch (err: unknown) {
      console.log('some error occured in addBeatmaps');
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        await this.addBeatmaps(beatmaps);
      }
    }
  }

  public async readBeatmaps(year: string): Promise<Partial<SheetBeatmap>[]> {
    try {
      const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[year];

      const rows = await sheet.getRows<SheetBeatmap>();
      return rows.map((r) => r.toObject());
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        return await this.readBeatmaps(year);
      }
      return [];
    }
  }

  public async readUnfinishedBeatmaps(): Promise<Partial<SheetBeatmap>[]> {
    try {
      const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];

      const rows = await sheet.getRows<SheetBeatmap>();
      return rows.map((r) => r.toObject());
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        return await this.readUnfinishedBeatmaps();
      }
      return [];
    }
  }

  public async updateUnfinishedBeatmaps(beatmaps: SheetUnfinishedBeatmaps[]) {
    try {
      const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];
      await sheet.clearRows({ start: 2 });
      await sheet.addRows(beatmaps, { raw: true });
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.log('some error occured');
      if (error.response?.status === 429) {
        await delay(30000);
        await this.updateUnfinishedBeatmaps(beatmaps);
      }
    }
  }

  public async readProblematicBeatmaps(): Promise<Partial<SheetBeatmap>[]> {
    try {
      const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[1];

      const rows = await sheet.getRows<SheetBeatmap>();
      return rows.map((r) => r.toObject());
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        return await this.readProblematicBeatmaps();
      }
      return [];
    }
  }

  public async updateProblematicBeatmaps(beatmaps: SheetUnfinishedBeatmaps[]) {
    try {
      const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[1];
      await sheet.clearRows({ start: 2 });
      await sheet.addRows(beatmaps, { raw: true });
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        await this.updateProblematicBeatmaps(beatmaps);
      }
    }
  }

  public async updateScoreOnBeatmap(year: string, link: string, score: UserScore) {
    try {
      const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
      await doc.loadInfo();

      const sheet = doc.sheetsByTitle[year];
      const rows = await sheet.getRows<SheetBeatmap>();

      const foundRow = rows.find((b) => b.get('Link') === link);
      if (!foundRow) throw new Error(`Row ${link} in ${year}, not found`);

      foundRow.set('Rank', score.score.rank);
      foundRow.set('Mods', score.score.mods.join(','));
      foundRow.set('Accuracy', numeral(score.score.accuracy * 100).format('0.00'));
      foundRow.set('Score', numeral(score.score.score).format('0,0'));

      await foundRow.save();
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 429) {
        await delay(30000);
        await this.updateScoreOnBeatmap(year, link, score);
      }
    }
  }
}
