/*
 * Route: /tracks/:trackId/plays
 */

const TrackPlayModel = rootRequire('/models/TrackPlayModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const trackAssociate = rootRequire('/middlewares/tracks/associate');

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

  if (user.id !== track.userId) {
    TrackPlayModel.create({
      userId: user.id,
      trackId: track.id,
    });
  }

  response.success();
}));

/*
 * Export
 */

module.exports = router;
