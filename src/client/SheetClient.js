const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = JSON.parse(process.env['GOOGLE_SERVICE_ACCOUNT']);
const { JWT } = require('google-auth-library');
const { createUserLinkFromId, createBeatmapLinkFromId } = require('../utils');
const numeral = require('numeral');

class SheetClient {
  constructor(leaderboard_sheet_id, unfinished_sheet_id, beatmaps_sheet_id) {
    this.leaderboard_sheet_id = leaderboard_sheet_id;
    this.unfinished_sheet_id = unfinished_sheet_id;
    this.beatmaps_sheet_id = beatmaps_sheet_id;

    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
    this.serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });
  }

  /**
   * @param {OsuRanking[]} users
   */
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

  /**
   * @param {string} year
   * @param {BeatmapModel[]} beatmaps
   */
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
        Rank: b.Score?.rank,
        Mods: b.Score?.mods,
        Accuracy: b.Score?.accuracy ? numeral(b.Score.accuracy).format('0.00') : undefined,
        Score: b.Score?.score ? numeral(b.Score.score).format('0,0') : undefined,
      })),
    );
  }

  async updateMissingBeatmaps(ids) {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Missing'];
    await sheet.clearRows({ start: 2 });
    await sheet.addRows(ids.map((i) => ({ Id: i })));
  }

  async getMissingBeatmaps() {
    const doc = new GoogleSpreadsheet(this.beatmaps_sheet_id, this.serviceAccountAuth);
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

  async updateProblematicBeatmaps(beatmaps) {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Problematic');
  }

  async updateNonSDBeatmaps(beatmaps) {
    await this.updateUnfinishedBeatmaps(beatmaps, 'Non SD');
  }

  async updateDtBeatmaps(beatmaps) {
    await this.updateUnfinishedBeatmaps(beatmaps, 'DT');
  }

  /**
   * @private
   */
  async updateUnfinishedBeatmaps(beatmaps, title) {
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

module.exports = SheetClient;
