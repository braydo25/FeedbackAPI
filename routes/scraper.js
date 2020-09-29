/*
 * Route: /scraper
 */

const userAuthorize = rootRequire('/middlewares/users/authorize');
const metascraperHelpers = rootRequire('/libs/metascraperHelpers');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', asyncMiddleware(async (request, response) => {
  const { url, html } = request.body;
  const result = await metascraperHelpers.extractMetadata(html, url);

  response.success(result);
}));

/*
 * Export
 */

module.exports = router;
