/*
 * Route: /notifications
 */

const NotificationModel = rootRequire('/models/NotificationModel');
const TrackCommentModel = rootRequire('/models/TrackCommentModel');
const TrackCommentLikeModel = rootRequire('/models/TrackCommentLikeModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', asyncMiddleware(async (request, response) => {
  const { user } = request;

  const commentNotifications = await NotificationModel.findAll({
    include: [
      {
        model: TrackCommentModel.scope([ 'withTrack', 'withUser', { method: [ 'withAuthUserLike', user.id ] } ]),
        required: true,
      },
    ],
    where: { userId: user.id },
    order: [ [ 'createdAt', 'DESC' ] ],
  });

  const commentLikeNotifications = await NotificationModel.findAll({
    include: [
      {
        model: TrackCommentLikeModel.scope([ 'withTrackComment', 'withUser' ]),
        required: true,
      },
    ],
    where: { userId: user.id },
    order: [ [ 'createdAt', 'DESC' ] ],
  });

  const notifications = [
    ...commentNotifications,
    ...commentLikeNotifications,
  ];

  notifications.sort((a, b) => b.createdAt - a.createdAt);

  response.success(notifications);
}));

/*
 * Export
 */

module.exports = router;
