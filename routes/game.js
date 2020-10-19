/*
 * Route: /game
 */

const TrackModel = rootRequire('/models/TrackModel');
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
  const scope = [ 'withGenre', 'withUser', { method: [ 'withRecentComments', 10 ] } ];
  const options = {
    where: [
      {
        genreId: user.preferredGenreIds,
        userId: { [Sequelize.Op.ne]: user.id },
        draft: false,
      },
      database.literal(`(track.id NOT IN (SELECT tp.trackId from trackPlays tp WHERE tp.userId = ${user.id}))`),
    ],
    order: [
      database.literal('-LOG(1.0 - RAND()) / (user.exp + 1)'),
      [ 'createdAt', 'DESC' ],
    ],
    group: [ 'track.userId' ],
    limit: 15,
  };

  const preferredTracks = await TrackModel.scope(scope).findAll(options);

  if (preferredTracks.length) {
    return response.success(preferredTracks);
  }

  delete options.where[0].genreId;

  const allTracks = await TrackModel.scope(scope).findAll(options);

  response.success(allTracks);
}));

/*
 * Export
 */

module.exports = router;
