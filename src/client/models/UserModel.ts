import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public declare id: number;
  public declare username: string;
  public declare country_code: string;
  public declare beatmap_playcounts_count: number;
  public declare count_100: number;
  public declare count_300: number;
  public declare count_50: number;
  public declare count_miss: number;
  public declare level_current: number;
  public declare level_progress: number;
  public declare pp: number;
  public declare ranked_score: number;
  public declare hit_accuracy: number;
  public declare play_count: number;
  public declare play_time: number;
  public declare total_score: number;
  public declare total_hits: number;
  public declare maximum_combo: number;
  public declare ss: number;
  public declare ssh: number;
  public declare s: number;
  public declare sh: number;
  public declare a: number;
}

export function initUser(sequelize: Sequelize) {
  User.init(
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
      country_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      beatmap_playcounts_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ranked_score: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      pp: {
        type: DataTypes.DOUBLE,
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
      play_time: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      total_hits: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      count_100: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maximum_combo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count_300: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      play_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count_50: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count_miss: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      level_current: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      level_progress: {
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
      ss: {
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
    { sequelize, tableName: 'user' },
  );
}
