import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes } from 'sequelize';

export class Unfinished extends Model<InferAttributes<Unfinished>, InferCreationAttributes<Unfinished>> {
  public declare user_id: number;
  public declare beatmap_id: number;
  public declare play_count: number;
}

export function initUnfinished(sequelize: Sequelize) {
  Unfinished.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      beatmap_id: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        primaryKey: true,
      },
      play_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'unfinished' },
  );
}
