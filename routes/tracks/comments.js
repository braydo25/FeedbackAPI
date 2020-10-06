/*
 * Route: /tracks/:trackId/comments/:trackCommentId?
 */

const NotificationModel = rootRequire('/models/NotificationModel');
const TrackCommentModel = rootRequire('/models/TrackCommentModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const trackAssociate = rootRequire('/middlewares/tracks/associate');
const trackAuthorize = rootRequire('/middlewares/tracks/authorize');
const trackCommentAuthorize = rootRequire('/middlewares/tracks/comments/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', trackAuthorize);
router.get('/', asyncMiddleware(async (request, response) => {
  const { track } = request;

  const trackComments = await TrackCommentModel.scope('withUser').findAll({
    where: { trackId: track.id },
    order: [ [ 'createdAt', 'DESC' ] ],
  });

  response.success(trackComments);
}));

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', trackAssociate);
router.post('/', asyncMiddleware(async (request, response) => {
  const { user, track } = request;
  const { text, time } = request.body;

  if (user.id === track.userId) {
    throw new Error('You cannot comment on your own tracks.');
  }

  const trackComment = await TrackCommentModel.create({
    trackId: track.id,
    userId: user.id,
    text,
    time,
  });

  NotificationModel.create({
    userId: track.userId,
    trackCommentId: trackComment.id,
  });

  response.success(trackComment);
}));

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', trackCommentAuthorize);
router.delete('/', asyncMiddleware(async (request, response) => {
  const { trackComment } = request;

  await trackComment.destroy();

  response.success();
}));

/*
 * Export
 */

module.exports = router;
