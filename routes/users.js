/*
 * Route: /users
 */

const router = express.Router({
  mergeParams: true,
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

router.patch('/me', (request, response) => {
  response.success();
});

/*
 * Export
 */

module.exports = router;
