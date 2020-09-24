/*
 * Track Ownership Authorization For Matching Routes
 * Must be mounted after users authorize.
 * Possible Route Usage: /{any}/tracks/:trackId/{any}
 */

const TrackModel = rootRequire('/models/TrackModel');

module.exports = asyncMiddleware(async (request, response, next) => {
  const { user } = request;
  const { trackId } = request.params;

  const track = await TrackModel.findOne({
    where: {
      id: trackId,
      userId: user.id,
    },
  });

  if (!track) {
    return response.respond(403, 'Insufficient track permissions.');
  }

  request.track = track;

  next();
});
