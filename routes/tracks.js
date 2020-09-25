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
  response.success();
}));

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', asyncMiddleware(async (request, response) => {
  const { user } = request;
  const { name, description, genreId } = request.body;

  const track = await TrackModel.create({
    userId: user.id,
    genreId,
    name,
    description,
  });

  response.success(track);
}));

/*
 * PATCH
 */

router.patch('/', userAuthorize);
router.patch('/', trackAuthorize);
router.patch('/', asyncMiddleware(async (request, response) => {
  const { track, files } = request;
  const { genreId, name, description } = request.body;
  const audioFile = (files && files.audio) ? files.audio : null;
  const data = {
    genreId: genreId || track.genreId,
    name: name || track.name,
    description: description || track.description,
  };

  if (audioFile && !track.mp3Url) {
    const audioData = await audioHelpers.processAndUploadAudio(audioFile, true);

    data.checksum = audioFile.md5;
    data.originalUrl = audioData.originalUrl;
    data.mp3Url = audioData.mp3Url;
    data.sampleRate = audioData.sampleRate;
    data.duration = audioData.duration;
    data.waveform = audioData.waveform;
  }

  await track.update(data);

  response.success(track);
}));

/*
 * DELETE
 */

router.delete('/', userAuthorize);
router.delete('/', asyncMiddleware(async (request, response) => {
  response.success();
}));

/*
 * Export
 */

module.exports = router;
