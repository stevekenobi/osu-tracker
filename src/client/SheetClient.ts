import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export class SheetClient {
  private readonly serviceAccountAuth: JWT;

  constructor(creds: any) {
    this.serviceAccountAuth = new JWT({ scopes: ['https://www.googleapis.com/auth/spreadsheets'], email: creds.client_email, key: creds.private_key });
  }

  public async createSheet(docId: string, title: string) {
    const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
    await doc.loadInfo();

    const addedSheet = await doc.addSheet({ title, headerValues: ['Link', 'Artist', 'Title', 'Creator', 'Version', 'Difficulty', 'Status', 'BPM', 'AR', 'CS', 'HP', 'OD', 'Date'] });
    return addedSheet;
  }

  public async getRows<T extends Record<string, number | string>>(docId: string, sheetId: string) {
    const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetId];

    if (!sheet) return [];

    const result = await sheet.getRows<T>();
    return result.map((x) => x.toObject());
  }

  public async addRows(docId: string, sheetId: string, rows: Record<string, number | string>[]) {
    let sheet: GoogleSpreadsheetWorksheet | undefined = undefined;
    const doc = new GoogleSpreadsheet(docId, this.serviceAccountAuth);
    await doc.loadInfo();

    sheet = doc.sheetsByTitle[sheetId];
    if (!sheet) {
      sheet = await this.createSheet(docId, sheetId);
    }
    await sheet.addRows(rows);
  }
}
