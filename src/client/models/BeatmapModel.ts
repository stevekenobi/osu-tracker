import { RankStatus } from '@/types/osu/enums';
import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes } from 'sequelize';

export class Beatmaps extends Model<InferAttributes<Beatmaps>, InferCreationAttributes<Beatmaps>> {
  public declare beatmapset_id: number;
  public declare difficulty_rating: number;
  public declare id: number;
  public declare status: RankStatus;
  public declare version: string;
  public declare artist: string;
  public declare creator: string;
  public declare title: string;
  public declare ar: number;
  public declare cs: number;
  public declare od: number;
  public declare hp: number;
  public declare bpm: number;
  public declare length: number;
  public declare ranked_date: Date;
}

export function initBeatmaps(sequelize: Sequelize) {
  Beatmaps.init(
    {
      beatmapset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty_rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ar: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      od: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bpm: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ranked_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'beatmaps' },
  );
}
