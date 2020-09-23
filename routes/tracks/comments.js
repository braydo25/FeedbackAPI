/*
 * Route: /tracks/:trackId/comments/:trackCommentId?
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
 * DELETE
 */

router.delete('/', (request, response) => {
  response.success();
});

/*
 * Export
 */

module.exports = router;
