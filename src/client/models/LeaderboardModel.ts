import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes } from 'sequelize';

export class Leaderboard extends Model<InferAttributes<Leaderboard>, InferCreationAttributes<Leaderboard>> {
  public declare id: number;
  public declare username: string;
  public declare 'ranked_score': number;
  public declare 'total_score': number;
  public declare 'hit_accuracy': number;
  public declare 'play_count': number;
  public declare 'ss': number;
  public declare 'ssh': number;
  public declare 'sh': number;
  public declare 's': number;
  public declare 'a': number;
}

export function initLeaderboard(sequelize: Sequelize) {
  Leaderboard.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ranked_score: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      hit_accuracy: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      total_score: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      play_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ss: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ssh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      s: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      a: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'leaderboard' },
  );
}
