import type { InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize';
import { DataTypes, Model } from 'sequelize';

export class Unfinished extends Model<InferAttributes<Unfinished>, InferCreationAttributes<Unfinished>> {
  public declare checksum: string;
}

export function initUnfinished(sequelize: Sequelize): void {
  Unfinished.init(
    {
      checksum: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Unfinished',
      timestamps: false,
    },
  );
}

module.exports = { initUnfinished, Unfinished };
