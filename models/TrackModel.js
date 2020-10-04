const GenreModel = rootRequire('/models/GenreModel');
const TrackCommentModel = rootRequire('/models/TrackCommentModel');
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
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Untitled Track',
  },
  description: {
    type: Sequelize.TEXT,
  },
  originalUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mp3Url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  checksum: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sampleRate: {
    type: Sequelize.INTEGER.UNSIGNED,
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
  draft: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
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
    withRecentComments: {
      include: [
        {
          attributes: [
            'id',
            'userId',
            'text',
            'time',
            'createdAt',
          ],
          model: TrackCommentModel.scope('withUser'),
          limit: 2,
          order: [ [ 'createdAt', 'DESC' ] ],
        },
      ],
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
