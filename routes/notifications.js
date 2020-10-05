/*
 * Route: /notifications
 */

const NotificationModel = rootRequire('/models/NotificationModel');
const TrackCommentModel = rootRequire('/models/TrackCommentModel');
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
  const notifications = await NotificationModel.findAll({
    include: [
      {
        model: TrackCommentModel.scope([ 'withTrack', 'withUser' ]),
        required: true,
      },
    ],
    where: { userId: user.id },
    order: [ [ 'createdAt', 'DESC' ] ],
  });

  response.success(notifications);
}));

/*
 * Export
 */

module.exports = router;
