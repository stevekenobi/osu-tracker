import type { InferAttributes, InferCreationAttributes} from 'sequelize';
import { DataTypes, Model } from 'sequelize';

export class Beatmaps extends Model<InferAttributes<Beatmaps>, InferCreationAttributes<Beatmaps>> {
  public declare id: number;
  public declare beatmapsetId: number;
  public declare artist: string;
  public declare title: string;
  public declare creator: string;
  public declare version: string;
  public declare difficulty: number;
  public declare AR: number;
  public declare CS: number;
  public declare OD: number;
  public declare HP: number;
  public declare BPM: number;
  public declare length: number;
  public declare status: string;
  public declare mode: string;
  public declare rankedDate: string;
  public declare accuracy: number;
  public declare max_combo: number;
  public declare mods: string;
  public declare perfect: boolean;
  public declare pp: number;
  public declare rank: string;
  public declare score: number;
  public declare count_100: number;
  public declare count_300: number;
  public declare count_50: number;
  public declare count_miss: number;
}

export function initBeatmaps(sequelize) {
  Beatmaps.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      beatmapsetId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      AR: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      CS: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      OD: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      HP: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      BPM: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rankedDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accuracy: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      max_combo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mods: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      perfect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      pp: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      score: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      count_100: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      count_300: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      count_50: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      count_miss: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Beatmaps',
    },
  );
}

module.exports = { initBeatmaps, Beatmaps };
