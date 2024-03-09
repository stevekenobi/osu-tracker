import type { InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';
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
  public declare checksum: string;
  public declare status: string;
  public declare mode: string;
  public declare rankedDate: string;
  public declare submittedDate: string;
  public declare unfinished: boolean;
  public declare accuracy?: number;
  public declare max_combo?: number;
  public declare mods?: string;
  public declare perfect?: boolean;
  public declare pp?: number;
  public declare rank?: string;
  public declare score?: number;
  public declare count_ok?: number;
  public declare count_great?: number;
  public declare count_meh?: number;
  public declare count_miss?: number;
}

export function initBeatmaps(sequelize: Sequelize): void {
  Beatmaps.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      beatmapsetId: {
        type: DataTypes.INTEGER,
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
      checksum: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      submittedDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unfinished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      count_ok: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      count_great: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      count_meh: {
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
      timestamps: false,
    },
  );
}

module.exports = { initBeatmaps, Beatmaps };
