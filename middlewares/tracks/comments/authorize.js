/*
 * Track Comment Authorization For Matching Routes
 * Must be mounted after users authorize.
 * Possible Route Usage: /{any}/trackComments/:trackCommentId/{any}
 */

const TrackCommentModel = rootRequire('/models/TrackCommentModel');

module.exports = asyncMiddleware(async (request, response, next) => {
  const { user } = request;
  const { trackCommentId } = request.params;

  const trackComment = await TrackCommentModel.findOne({
    where: {
      id: trackCommentId,
      userId: user.id,
    },
  });

  if (!trackComment) {
    return response.respond(403, 'Insufficient track comment permissions.');
  }

  request.trackComment = trackComment;

  next();
});
