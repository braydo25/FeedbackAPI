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
  const { trackId } = request.params;

  if (trackId) {
    const track = await TrackModel.scope([ 'withGenre', 'withUser' ]).findOne({
      where: {
        id: trackId,
        userId: user.id,
      },
    });

    if (!track) {
      throw new Error('This track does not exist.');
    }

    return response.success(track);
  }

  const tracks = await TrackModel.scope([ 'withGenre', 'withRecentComments', 'withUser' ]).findAll({
    where: {
      userId: user.id,
      draft: false,
    },
    order: [ [ 'createdAt', 'DESC' ] ],
  });

  response.success(tracks);
}));

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', asyncMiddleware(async (request, response) => {
  const { user } = request;

  const track = await TrackModel.create({ userId: user.id });

  response.success(track);
}));

/*
 * PATCH
 */

router.patch('/', userAuthorize);
router.patch('/', trackAuthorize);
router.patch('/', asyncMiddleware(async (request, response) => {
  const { files } = request;
  const { genreId, name, description } = request.body;
  const audioFile = (files && files.audio) ? files.audio : null;
  let audioData = null;
  let track = request.track;

  if (audioFile && !track.mp3Url) {
    const existingTrackWithAudio = await TrackModel.findOne({
      where: { checksum: audioFile.md5 },
    });

    if (existingTrackWithAudio) {
      throw new Error('This audio has already been uploaded by you or another user.');
    }

    audioData = await audioHelpers.processAndUploadAudio(audioFile, true);
  }

  // get freshest track in the event there was another patch during this request.
  track = (audioData) ? await TrackModel.findOne({
    where: { id: track.id },
  }) : track;

  const data = {
    ...track.toJSON(),
    ...(audioData ? {
      checksum: audioFile.md5,
      originalUrl: audioData.originalUrl,
      mp3Url: audioData.mp3Url,
      sampleRate: audioData.sampleRate,
      duration: audioData.duration,
      waveform: audioData.waveform,
    } : {}),
    genreId: genreId || track.genreId,
    name: name || track.name,
    description: description || track.description,
  };

  if (data.name && data.genreId && data.mp3Url) {
    data.draft = false;
  }

  await track.update(data);

  track = await TrackModel.scope([ 'withGenre', 'withUser' ]).findOne({
    where: { id: track.id },
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
