const GenreModel = rootRequire('/models/GenreModel');

/*
 * Model Definition
 */

const TrackModel = database.define('track', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  genreId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  originalUrl: {
    type: Sequelize.STRING,
  },
  mp3Url: {
    type: Sequelize.STRING,
  },
  checksum: {
    type: Sequelize.STRING,
  },
  sampleRate: {
    type: Sequelize.INTEGER,
  },
  waveform: {
    type: Sequelize.JSON,
  },
  duration: {
    type: Sequelize.INTEGER.UNSIGNED,
  },
}, {
  scopes: {
    withGenre: {
      include: [ { model: GenreModel } ],
    },
  },
});

/*
 * Export
 */

module.exports = TrackModel;
