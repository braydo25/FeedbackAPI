const levelsConfig = rootRequire('/config/levels');

/*
 * Model Definition
 */

const TrackCommentModel = database.define('trackComment', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  trackId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      minLength(value) {
        if (value.length < 10) {
          throw new Error('Your feedback must be at least 10 characters long.');
        }
      },
      checkSpam(value) {
        if (value.split(' ').length < 2 || (new Set(value)).size < 5) {
          throw new Error("Spamming doesn't help others.. Don't spam. Continuing may result in a ban.");
        }
      },
    },
  },
  time: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  scopes: {
    withTrack: () => ({
      include: [ database.models.track.unscoped().scope('minimal') ],
    }),
    withUser: () => ({
      include: [ database.models.user.scope('trackUser') ],
    }),
  },
});

/*
 * Hooks
 */

TrackCommentModel.addHook('afterCreate', async (trackComment, options) => {
  const TrackModel = database.models.track;
  const UserModel = database.models.user;

  await TrackModel.update({ totalComments: database.literal('totalComments + 1') }, {
    where: { id: trackComment.trackId },
    transaction: options.transaction,
  });

  await UserModel.update({ exp: database.literal(`exp + ${levelsConfig.commentExp}`) }, {
    where: { id: trackComment.userId },
    transaction: options.transaction,
  });
});

TrackCommentModel.addHook('afterDestroy', async (trackComment, options) => {
  const TrackModel = database.models.track;
  const UserModel = database.models.user;

  await TrackModel.update({ totalComments: database.literal('totalComments - 1') }, {
    where: { id: trackComment.trackId },
    transaction: options.transaction,
  });

  await UserModel.update({ exp: database.literal(`exp - ${levelsConfig.commentExp}`) }, {
    where: { id: trackComment.userId },
    transaction: options.transaction,
  });
});

/*
 * Export
 */

module.exports = TrackCommentModel;
