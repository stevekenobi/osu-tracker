const { DataTypes, Model } = require('sequelize');

class Leaderboard extends Model {}

function initLeaderboard(sequelize) {
  Leaderboard.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rankedScore: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      totalScore: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      hitAccuracy: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      playcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SSH: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SS: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SH: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      S: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      A: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Leaderboard',
    },
  );
}

module.exports = { initLeaderboard, Leaderboard };
