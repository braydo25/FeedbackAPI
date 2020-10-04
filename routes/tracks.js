/*
 * Route: /tracks/:trackId?
 */

const TrackModel = rootRequire('/models/TrackModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const trackAuthorize = rootRequire('/middlewares/tracks/authorize');
const audioHelpers = rootRequire('/libs/audioHelpers');

const router = express.Router({
  mergeParams: true,
});

/*
 * GET
 */

router.get('/', userAuthorize);
router.get('/', asyncMiddleware(async (request, response) => {
  const { user } = request;

  const tracks = await TrackModel.scope([ 'withGenre', 'withRecentComments', 'withUser' ]).findAll({
    where: {
      userId: user.id,
      draft: false,
    },
  });

  response.success(tracks);
}));

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', asyncMiddleware(async (request, response) => {
  const { user, files } = request;
  const { name, description, genreId, draft } = request.body;
  const audioFile = (files && files.audio) ? files.audio : null;

  if (!audioFile) {
    throw new Error('An audio file must be provided.');
  }

  const existingTrackWithAudio = await TrackModel.findOne({
    where: {
      checksum: audioFile.md5,
      draft: false,
    },
  });

  if (existingTrackWithAudio) {
    throw new Error('This audio has already been uploaded by you or another user.');
  }

  const audioData = await audioHelpers.processAndUploadAudio(audioFile, true);

  const track = await TrackModel.create({
    userId: user.id,
    name,
    description,
    genreId,
    checksum: audioFile.md5,
    originalUrl: audioData.originalUrl,
    mp3Url: audioData.mp3Url,
    sampleRate: audioData.sampleRate,
    duration: audioData.duration,
    waveform: audioData.waveform,
    draft,
  });

  response.success(track);
}));

/*
 * PATCH
 */

router.patch('/', userAuthorize);
router.patch('/', trackAuthorize);
router.patch('/', asyncMiddleware(async (request, response) => {
  const { track } = request;
  const { genreId, name, description, draft } = request.body;

  if (!genreId && !track.genreId) {
    throw new Error('A genreId must be provided.');
  }

  if (!name && !track.name) {
    throw new Error('A name must be provided.');
  }

  await track.update({
    genreId: genreId || track.genreId,
    name: name || track.name,
    description: description || track.description,
    draft: draft !== undefined ? draft : track.draft,
  });

  response.success(track);
}));

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', trackAuthorize);
router.delete('/', asyncMiddleware(async (request, response) => {
  const { track } = request;

  await track.destroy();

  response.success();
}));

/*
 * Export
 */

module.exports = router;
