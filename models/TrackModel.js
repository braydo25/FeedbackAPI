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
  },
  mp3Url: {
    type: Sequelize.STRING,
  },
  checksum: {
    type: Sequelize.STRING,
  },
  sampleRate: {
    type: Sequelize.INTEGER.UNSIGNED,
  },
  waveform: {
    type: Sequelize.JSON,
  },
  duration: {
    type: Sequelize.INTEGER.UNSIGNED,
  },
  totalComments: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  totalPlays: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  draft: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
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
      'totalComments',
      'totalPlays',
      'createdAt',
    ],
  },
  scopes: {
    minimal: () => ({
      attributes: [ 'id', 'name', 'mp3Url' ],
    }),
    withGenre: () => ({
      include: [ database.models.genre ],
    }),
    withRecentComments: ({ userId, limit }) => ({
      include: [
        {
          attributes: [
            'id',
            'userId',
            'text',
            'time',
            'createdAt',
          ],
          model: database.models.trackComment.scope([ 'withUser', {
            method: [ 'withAuthUserLike', userId ],
          } ]),
          limit: limit || 2,
          order: [ [ 'createdAt', 'DESC' ] ],
        },
      ],
    }),
    withUser: () => ({
      include: [ { model: database.models.user.scope('trackUser') } ],
    }),
  },
});

/*
 * Hooks
 */

TrackModel.addHook('afterCreate', async (track, options) => {
  const UserModel = database.models.user;

  await UserModel.update({ totalTracks: database.literal('totalTracks + 1') }, {
    where: { id: track.userId },
    transaction: options.transaction,
  });
});

TrackModel.addHook('afterDestroy', async (track, options) => {
  const UserModel = database.models.user;

  await UserModel.update({ totalTracks: database.literal('totalTracks - 1') }, {
    where: { id: track.userId },
    transaction: options.transaction,
  });
});

/*
 * Export
 */

module.exports = TrackModel;
