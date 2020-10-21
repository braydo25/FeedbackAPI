/*
 * Route: /game
 */

const TrackModel = rootRequire('/models/TrackModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const { shuffleArray } = rootRequire('/libs/utilityHelpers');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', asyncMiddleware(async (request, response) => {
  const { user } = request;
  const scope = [
    'withGenre',
    'withUser',
    { method: [ 'withRecentComments', { userId: user.id, limit: 10 } ],
    },
  ];

  const optionsPrioritized = {
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
    limit: 6,
  };

  const optionsNoComments = {
    where: [
      {
        genreId: user.preferredGenreIds,
        userId: { [Sequelize.Op.ne]: user.id },
        totalComments: 0,
        draft: false,
      },
      database.literal(`(track.id NOT IN (SELECT tp.trackId from trackPlays tp WHERE tp.userId = ${user.id}))`),
    ],
    order: [
      database.literal('RAND()'),
      [ 'createdAt', 'DESC' ],
    ],
    group: [ 'track.userId' ],
    limit: 6,
  };

  const preferredTracksPrioritized = await TrackModel.scope(scope).findAll(optionsPrioritized);
  const preferredTracksNoComments = await TrackModel.scope(scope).findAll(optionsNoComments);

  if (preferredTracksPrioritized.length || preferredTracksNoComments.length) {
    return response.success(shuffleArray([
      ...preferredTracksPrioritized,
      ...preferredTracksNoComments,
    ]));
  }

  delete optionsPrioritized.where[0].genreId;
  delete optionsNoComments.where[0].genreId;

  response.success(shuffleArray([
    ...(await TrackModel.scope(scope).findAll(optionsPrioritized)),
    ...(await TrackModel.scope(scope).findAll(optionsNoComments)),
  ]));
}));

/*
 * Export
 */

module.exports = router;
