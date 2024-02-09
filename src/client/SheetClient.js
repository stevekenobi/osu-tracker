const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../../google_service_account.json');
const { JWT } = require('google-auth-library');
const { createUserLinkFromId } = require('../utils');
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
   * @param {Array<OsuRanking>} users
   */
  async updateLeaderboard(users) {
    const doc = new GoogleSpreadsheet(this.leaderboard_sheet_id, this.serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

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
}

module.exports = SheetClient;
