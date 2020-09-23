/*
 * Route: /game
 */

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', (request, response) => {
  response.success();
});

/*
 * Export
 */

module.exports = router;
