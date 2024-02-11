const { DataTypes, Model } = require('sequelize');

class Beatmaps extends Model {}

function initBeatmaps(sequelize) {
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
      rankedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'Beatmaps',
    },
  );
}

module.exports = { initBeatmaps, Beatmaps };
