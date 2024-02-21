import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../../google_service_account.json';
import { JWT } from 'google-auth-library';
import { createUserLinkFromId, createBeatmapLinkFromId } from '../utils';
import numeral from 'numeral';

export default class SheetClient {
  private readonly serviceAccountAuth;
  constructor(
    private readonly leaderboard_sheet_id,
    private readonly unfinished_sheet_id,
    private readonly beatmaps_sheet_id) {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
    this.serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });
  }

  async updateLeaderboard(users) {
    const doc = new GoogleSpreadsheet(this.leaderboard_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['GR'];

    await sheet.clearRows({ start: 2 });
    await sheet.addRows(
      users.map((u, index) => ({
        '#': index + 1,
        Link: createUserLinkFromId(u.user.id),
        Username: u.user.username,
        'Ranked Score': numeral(u.ranked_score).format('0,0'),
        'Total Score': numeral(u.total_score).format('0,0'),
        Accuracy: numeral(u.hit_accuracy).format('0.00'),
        Playcount: numeral(u.play_count).format('0,0'),
        SSH: numeral(u.grade_counts.ssh).format('0,0'),
        SS: numeral(u.grade_counts.ss).format('0,0'),
        SH: numeral(u.grade_counts.sh).format('0,0'),
        S: numeral(u.grade_counts.s).format('0,0'),
        A: numeral(u.grade_counts.a).format('0,0'),
      })),
      { raw: true },
    );
  }

  async updateBeatmapsOfYear(year, beatmaps) {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[year];

    await sheet.clearRows({ start: 2 });
    await sheet.addRows(
      beatmaps.map((b) => ({
        Link: createBeatmapLinkFromId(b.id),
        Artist: b.artist,
        Title: b.title,
        Creator: b.creator,
        Version: b.version,
        Difficulty: b.difficulty,
        Status: b.status,
        BPM: b.BPM,
        AR: b.AR,
        CS: b.CS,
        HP: b.HP,
        OD: b.OD,
        Length: b.length,
        Rank: b.rank,
        Mods: b.mods,
        Accuracy: b.accuracy ? numeral(b.accuracy).format('0.00') : undefined,
        Score: b.score ? numeral(b.score).format('0,0') : undefined,
      })),
    );
  }

  async updateStats(stats) {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Stats'];
    await sheet.clearRows({ start: 2, end: 22 });

    await sheet.addRows(stats);
  }

  async updateMissingBeatmaps(ids) {
    const doc = new GoogleSpreadsheet(process.env.DEV_BEATMAPS_SHEET_ID, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];
    await sheet.addRows(ids.map((i) => ({ Id: i })));
  }

  async clearMissingBeatmaps() {
    const doc = new GoogleSpreadsheet(process.env.DEV_BEATMAPS_SHEET_ID, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];
    await sheet.clearRows({ start: 2 });
  }

  async getMissingBeatmaps() {
    const doc = new GoogleSpreadsheet(process.env.DEV_BEATMAPS_SHEET_ID, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];

    return (await sheet.getRows()).map((r) => r.get('Id'));
  }

  async updateNoScoreBeatmaps(beatmaps) {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['No Score'];

    await sheet.clearRows({ start: 2 });
    await sheet.addRows(
      beatmaps.map((b) => ({
        Link: createBeatmapLinkFromId(b.beatmap_id),
        Artist: b.beatmapset.artist,
        Title: b.beatmapset.title,
        Creator: b.beatmapset.creator,
        Version: b.beatmap.version,
        Difficulty: b.beatmap.difficulty_rating,
        Status: b.beatmap.status,
        Length: b.beatmap.total_length,
        Playcount: b.count,
      })),
    );
  }

  async getNoScoreBeatmaps() {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['No Score'];

    return (await sheet.getRows()).map((r) => r.toObject());
  }

  async getUnfinishedBeatmaps(title) {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[title];

    return (await sheet.getRows()).map((r) => r.toObject());
  }

  async updateProblematicBeatmaps(beatmaps) {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Problematic');
  }

  async updateNonSDBeatmaps(beatmaps) {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Non SD');
  }

  async updateDtBeatmaps(beatmaps) {
    await this.updateUnfinishedBeatmaps(beatmaps, 'DT');
  }

  private async updateUnfinishedBeatmaps(beatmaps, title) {
    const doc = new GoogleSpreadsheet(this.unfinished_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[title];

    await sheet.clearRows({ start: 2 });

    await sheet.addRows(
      beatmaps.map((b) => ({
        Link: createBeatmapLinkFromId(b.id),
        Artist: b.artist,
        Title: b.title,
        Creator: b.creator,
        Version: b.version,
        Difficulty: b.difficulty,
        Status: b.status,
        BPM: b.BPM,
        AR: b.AR,
        CS: b.CS,
        HP: b.HP,
        OD: b.OD,
        Length: b.length,
      })),
    );
  }
}
