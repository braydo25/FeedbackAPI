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
router.get('/', (request, response) => {

});

/*
 * Export
 */

module.exports = router;
