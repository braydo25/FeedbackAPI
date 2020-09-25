/*
 * Route: /genres
 */

const GenreModel = rootRequire('/models/GenreModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', asyncMiddleware(async (request, response) => {
  const genres = await GenreModel.findAll();

  response.success(genres);
}));

/*
 * Export
 */

module.exports = router;
