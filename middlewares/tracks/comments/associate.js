/*
 * Track Association For Matching Routes
 * Possible Route Usage: /{any}/tracks/:trackId/{any}/trackComments/:trackCommentId
 */

const TrackCommentModel = rootRequire('/models/TrackCommentModel');

module.exports = asyncMiddleware(async (request, response, next) => {
  const { trackCommentId } = request.params;

  const trackComment = await TrackCommentModel.findOne({
    where: { id: trackCommentId },
  });

  if (!trackComment) {
    return response.respond(404, 'Track comment not found.');
  }

  request.trackComment = trackComment;

  next();
});
