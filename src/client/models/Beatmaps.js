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
