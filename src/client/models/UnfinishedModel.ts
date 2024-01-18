import { RankStatus } from '@/types/osu/enums';
import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes } from 'sequelize';

export class Unfinished extends Model<InferAttributes<Unfinished>, InferCreationAttributes<Unfinished>> {
  public declare beatmapset_id: number;
  public declare difficulty_rating: number;
  public declare id: number;
  public declare status: RankStatus;
  public declare version: string;
  public declare artist: string;
  public declare creator: string;
  public declare title: string;
  public declare play_count: number;
}

export function initUnfinished(sequelize: Sequelize) {
  Unfinished.init(
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
      play_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'unfinished' },
  );
}
