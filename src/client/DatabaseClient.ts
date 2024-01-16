import { Leaderboard, initLeaderboard } from './models/LeaderboardModel';
import { Scores, initScores } from './models/ScoreModel';
import { Unfinished, initUnfinished } from './models/UnfinishedModel';
import { User, initUser } from './models/UserModel';
import { getSequelizeSingleton, initModels } from './models/initialize';
import { LeaderboardUser, UserPlayedBeatmaps, UserScore, User as OsuUser } from '@/types';

export class DatabaseClient {
  constructor() {}

  public async init() {
    console.log('Initializing Database');

    initModels();

    initUser(getSequelizeSingleton());
    initLeaderboard(getSequelizeSingleton());
    initScores(getSequelizeSingleton());
    initUnfinished(getSequelizeSingleton());

    // options: {force: true} -> drop and recreate
    // options: {alter: true} -> amend tables
    await getSequelizeSingleton().sync({ alter: true });
  }

  public async getSystemUser() {
    const user = (await User.findAll())[0];

    return user;
  }

  public async updateSystemUser(user: User, leaderboard_position: number): Promise<void> {
    await User.upsert({
      id: user.id,
      username: user.username,
      country_code: user.country_code,
      pp: user.pp,
      beatmap_playcounts_count: user.beatmap_playcounts_count,
      hit_accuracy: user.hit_accuracy,
      level_current: user.level_current,
      level_progress: user.level_progress,
      maximum_combo: user.maximum_combo,
      play_count: user.play_count,
      play_time: user.play_time,
      ranked_score: user.ranked_score,
      total_score: user.total_score,
      total_hits: user.total_hits,
      count_100: user.count_100,
      count_300: user.count_300,
      count_50: user.count_50,
      count_miss: user.count_miss,
      a: user.a,
      sh: user.sh,
      s: user.s,
      ssh: user.ssh,
      ss: user.ss,
      leaderboard_position,
    });
  }

  public async updateSystemUserFromOsu(user: OsuUser): Promise<void> {
    await User.upsert({
      id: user.id,
      username: user.username,
      country_code: user.country_code,
      pp: user.statistics.pp,
      beatmap_playcounts_count: user.beatmap_playcounts_count,
      hit_accuracy: user.statistics.hit_accuracy,
      level_current: user.statistics.level.current,
      level_progress: user.statistics.level.progress,
      maximum_combo: user.statistics.maximum_combo,
      play_count: user.statistics.play_count,
      play_time: user.statistics.play_time,
      ranked_score: user.statistics.ranked_score,
      total_score: user.statistics.total_score,
      total_hits: user.statistics.total_hits,
      count_100: user.statistics.count_100,
      count_300: user.statistics.count_300,
      count_50: user.statistics.count_50,
      count_miss: user.statistics.count_miss,
      a: user.statistics.grade_counts.a,
      sh: user.statistics.grade_counts.sh,
      s: user.statistics.grade_counts.s,
      ssh: user.statistics.grade_counts.ssh,
      ss: user.statistics.grade_counts.ss,
      leaderboard_position: 0,
    });
  }

  public async getLeaderboard() {
    return await Leaderboard.findAll();
  }

  public async updateLeaderboard(leaderboard: LeaderboardUser[]) {
    await Leaderboard.destroy({
      where: {},
      truncate: true,
    });
    await Leaderboard.bulkCreate(
      leaderboard.map((user) => ({
        id: user.user.id,
        username: user.user.username,
        ranked_score: user.ranked_score,
        total_score: user.total_score,
        hit_accuracy: user.hit_accuracy,
        play_count: user.play_count,
        ss: user.grade_counts.ss,
        ssh: user.grade_counts.ssh,
        sh: user.grade_counts.sh,
        s: user.grade_counts.s,
        a: user.grade_counts.a,
      })),
    );
  }

  public async updateUserScores(scores: UserScore[]) {
    await Scores.bulkCreate(
      scores.map((score) => ({
        accuracy: Math.round(score.score.accuracy * 10000) / 100,
        created_at: score.score.created_at,
        id: score.score.id,
        beatmap_id: score.score.beatmap.id,
        max_combo: score.score.max_combo,
        mode: score.score.mode,
        mods: score.score.mods.join(','),
        perfect: score.score.perfect,
        pp: score.score.pp,
        rank: score.score.rank,
        score: score.score.score,
        count_100: score.score.statistics.count_100,
        count_300: score.score.statistics.count_300,
        count_50: score.score.statistics.count_50,
        count_geki: score.score.statistics.count_geki,
        count_katu: score.score.statistics.count_katu,
        count_miss: score.score.statistics.count_miss,
      })),
    );
  }

  public async updateUnfinishedBeatmaps(beatmaps: UserPlayedBeatmaps[]) {
    await Unfinished.bulkCreate(
      beatmaps.map((b) => ({
        beatmapset_id: b.beatmapset.id,
        difficulty_rating: b.beatmap.difficulty_rating,
        id: b.beatmap_id,
        status: b.beatmap.status,
        version: b.beatmap.version,
        artist: b.beatmapset.artist,
        creator: b.beatmapset.creator,
        title: b.beatmapset.title,
      })),
    );
  }

  public async findScoreOnBeatmap(beatmap_id: number) {
    return await Scores.findByPk(beatmap_id);
  }
}
