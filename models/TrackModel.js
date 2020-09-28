const GenreModel = rootRequire('/models/GenreModel');
const UserModel = rootRequire('/models/UserModel');

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
  defaultScope: {
    attributes: [
      'id',
      'userId',
      'genreId',
      'name',
      'description',
      'originalUrl',
      'mp3Url',
      'sampleRate',
      'waveform',
      'duration',
    ],
  },
  scopes: {
    withGenre: {
      include: [ { model: GenreModel } ],
    },
    withUser: {
      include: [ { model: UserModel.scope('trackUser') } ],
    },
  },
});

/*
 * Export
 */

module.exports = TrackModel;
