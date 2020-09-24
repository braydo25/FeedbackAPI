/*
 * Model Definition
 */

const TrackCommentModel = rootRequire('/models/TrackCommentModel');

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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  genre: {
    type: Sequelize.STRING,
    // TODO (String or association?)
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
    type: Sequelize.INTEGER,
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
}, {
  defaultScope: {
    attributes: [
      'id',
      'url',
      'waveform',
      'duration',
      'description',
      'genre',
    ],
  },
  scopes: {
    withFeedback: {
      include: [
        {
          model: TrackCommentModel,
          limit: 10,
          order: [ [ 'createdAt', 'DESC' ] ],
        },
      ],
    },
  },
});

/*
 * Export
 */

module.exports = TrackModel;
