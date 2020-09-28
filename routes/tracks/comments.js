/*
 * Route: /tracks/:trackId/comments/:trackCommentId?
 */

const TrackCommentModel = rootRequire('/models/TrackCommentModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const trackAssociate = rootRequire('/middlewares/tracks/associate');
const trackCommentAuthorize = rootRequire('/middlewares/tracks/comments/authorize');

const router = express.Router({
  mergeParams: true,
});

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
