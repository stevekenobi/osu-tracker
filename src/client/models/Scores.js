const { DataTypes, Model } = require('sequelize');

class Scores extends Model {}

function initScores(sequelize) {
  Scores.init(
    {
      accuracy: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      beatmap_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
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
        allowNull: true,
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
      count_miss: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Scores',
    },
  );
}

module.exports = { initScores, Scores };
