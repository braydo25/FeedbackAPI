/*
 * Model Definition
 */

const TrackModel = database.define('track', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  checksum: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  waveform: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  duration: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  genre: {
    type: Sequelize.STRING,
    // TODO (String or association?)
  },
});

/*
 * Export
 */

module.exports = TrackModel;
