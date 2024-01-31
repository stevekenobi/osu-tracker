import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes } from 'sequelize';

export class Scores extends Model<InferAttributes<Scores>, InferCreationAttributes<Scores>> {
  public declare accuracy: number;
  public declare created_at: string;
  public declare id: number;
  public declare beatmap_id: number;
  public declare user_id: number;
  public declare max_combo: number;
  public declare mode: string;
  public declare mods: string;
  public declare perfect: boolean;
  public declare pp: number;
  public declare rank: string;
  public declare score: number;
  public declare count_100: number;
  public declare count_300: number;
  public declare count_50: number;
  public declare count_geki: number;
  public declare count_katu: number;
  public declare count_miss: number;
}

export function initScores(sequelize: Sequelize) {
  Scores.init(
    {
      accuracy: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      beatmap_id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      max_combo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mods: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      perfect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pp: {
        type: DataTypes.DOUBLE,
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      count_100: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count_300: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count_50: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count_geki: {
        type: DataTypes.INTEGER,
      },
      count_katu: {
        type: DataTypes.INTEGER,
      },
      count_miss: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'scores' },
  );
}
