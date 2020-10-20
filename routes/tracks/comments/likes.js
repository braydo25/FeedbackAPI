/*
 * Route: /tracks/:trackId/comments/:trackCommentId/likes/:trackCommentLikeId?
 */

const NotificationModel = rootRequire('/models/NotificationModel');
const TrackCommentLikeModel = rootRequire('/models/TrackCommentLikeModel');
const UserDeviceModel = rootRequire('/models/UserDeviceModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const trackCommentAssociate = rootRequire('/middlewares/tracks/comments/associate');
const trackCommentLikeAuthorize = rootRequire('/middlewares/tracks/comments/likes/authorize');
const levelsConfig = rootRequire('/config/levels');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', trackCommentAssociate);
router.post('/', asyncMiddleware(async (request, response) => {
  const { user, trackComment } = request;

  let trackCommentLike = await TrackCommentLikeModel.findOne({
    where: {
      userId: user.id,
      trackCommentId: trackComment.id,
    },
    paranoid: false,
  });

  if (!trackCommentLike) {
    trackCommentLike = await TrackCommentLikeModel.create({
      userId: user.id,
      trackCommentId: trackComment.id,
    });

    NotificationModel.create({
      userId: trackComment.userId,
      trackCommentLikeId: trackCommentLike.id,
    });

    UserDeviceModel.sendPushNotificationForUserId({
      userId: trackComment.userId,
      title: `${user.name} Liked Your Comment!`,
      message: `You earned ${levelsConfig.commentLikeExp} EXP from this "like" on your comment "${trackComment.text}".`,
    });
  } else if (trackCommentLike.deletedAt) {
    await trackCommentLike.restore();
  }

  response.success(trackCommentLike);
}));

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', trackCommentLikeAuthorize);
router.delete('/', asyncMiddleware(async (request, response) => {
  const { trackCommentLike } = request;

  await trackCommentLike.destroy();

  response.success();
}));

/*
 * Export
 */

module.exports = router;
