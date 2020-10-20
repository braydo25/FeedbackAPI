const levelsConfig = rootRequire('/config/levels');

/*
 * Model Definition
 */

const TrackCommentLikeModel = database.define('trackCommentLike', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  trackCommentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
}, {
  scopes: {
    withTrackComment: () => ({
      include: [
        {
          model: database.models.trackComment.scope('withTrack'),
          required: true,
        },
      ],
    }),
    withUser: () => ({
      include: [
        {
          model: database.models.user.scope('trackUser'),
          required: true,
        },
      ],
    }),
  },
});

/*
 * Hooks
 */

TrackCommentLikeModel.addHook('afterCreate', afterLikeCreate);
TrackCommentLikeModel.addHook('afterRestore', afterLikeCreate);

async function afterLikeCreate (trackCommentLike, options) {
  const TrackCommentModel = database.models.trackComment;
  const UserModel = database.models.user;

  await TrackCommentModel.update({ totalLikes: database.literal('totalLikes + 1') }, {
    where: { id: trackCommentLike.trackCommentId },
    transaction: options.transaction,
  });

  const trackComment = await TrackCommentModel.findOne({
    attributes: [ 'userId' ],
    where: { id: trackCommentLike.trackCommentId },
  });

  await UserModel.update({ exp: database.literal(`exp + ${levelsConfig.commentLikeExp}`) }, {
    where: { id: trackComment.userId },
    transaction: options.transaction,
  });
}

TrackCommentLikeModel.addHook('afterDestroy', async (trackCommentLike, options) => {
  const TrackCommentModel = database.models.trackComment;
  const UserModel = database.models.user;

  await TrackCommentModel.update({ totalLikes: database.literal('totalLikes - 1') }, {
    where: { id: trackCommentLike.trackCommentId },
    transaction: options.transaction,
  });

  const trackComment = await TrackCommentModel.findOne({
    attributes: [ 'userId' ],
    where: { id: trackCommentLike.trackCommentId },
  });

  await UserModel.update({ exp: database.literal(`exp - ${levelsConfig.commentLikeExp}`) }, {
    where: { id: trackComment.userId },
    transaction: options.transaction,
  });
});

/*
 * Export
 */

module.exports = TrackCommentLikeModel;