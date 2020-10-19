/*
 * Track Comment Authorization For Matching Routes
 * Must be mounted after users authorize.
 * Possible Route Usage: /{any}/trackComments/:trackCommentId/{any}/likes/:trackCommentLikeId
 */

const TrackCommentLikeModel = rootRequire('/models/TrackCommentLikeModel');

module.exports = asyncMiddleware(async (request, response, next) => {
  const { user } = request;
  const { trackCommentLikeId } = request.params;
  const trackCommentLike = await TrackCommentLikeModel.findOne({
    where: {
      id: trackCommentLikeId,
      userId: user.id,
    },
  });

  if (!trackCommentLike) {
    return response.respond(403, 'Insufficient track comment like permissions.');
  }

  request.trackCommentLike = trackCommentLike;

  next();
});
