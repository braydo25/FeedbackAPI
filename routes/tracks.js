/*
 * Route: /tracks/:trackId?
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
 * POST
 */

router.post('/', (request, response) => {
  response.success();
});

/*
 * PATCH
 */

router.patch('/', (request, response) => {
  response.success();
});

/*
 * DELETE
 */

router.delete('/', (request, response) => {
  response.success();
});

/*
 * Export
 */

module.exports = router;
