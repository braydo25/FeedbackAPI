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
  const tracks = await TrackModel.scope([ 'withGenre', 'withUser' ]).findAll({
    where: {
      userId: { [Sequelize.Op.ne]: user.id },
    },
  });

  response.success(tracks);
}));

/*
 * Export
 */

module.exports = router;
