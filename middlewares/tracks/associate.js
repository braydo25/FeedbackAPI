/*
 * Track Association For Matching Routes
 * Possible Route Usage: /{any}/tracks/:trackId/{any}
 */

const TrackModel = rootRequire('/models/TrackModel');

module.exports = asyncMiddleware(async (request, response, next) => {
  const { trackId } = request.params;

  const track = await TrackModel.findOne({
    where: { id: trackId },
  });

  if (!track) {
    return response.respond(404, 'Track not found.');
  }

  request.track = track;

  next();
});
