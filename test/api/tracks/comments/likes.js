const helpers = require('../../../helpers');

describe('Track Comments Likes', () => {
  let scopedTrackCommentLike = null;

  /*
   * POST
   */

  describe('POST /tracks/:trackId/comments/likes', () => {
    it('200s with created track comment like', done => {
      chai.request(server)
        .post(`/tracks/${testTrackThree.id}/comments/${testTrackThreeComment.id}/likes`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          scopedTrackCommentLike = response.body;
          done();
        });
    });

    it('200s with existing track comment like', done => {
      chai.request(server)
        .post(`/tracks/${testTrackThree.id}/comments/${testTrackThreeComment.id}/likes`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(scopedTrackCommentLike.id);
          done();
        });
    });

    it('200s with existing deleted track comment like and undeletes it', done => {
      chai.request(server)
        .delete(`/tracks/${testTrackThree.id}/comments/${testTrackThreeComment.id}/likes/${scopedTrackCommentLike.id}`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .end(async (error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          await (new Promise(resolve => setTimeout(resolve, 1000)));
          chai.request(server)
            .post(`/tracks/${testTrackThree.id}/comments/${testTrackThreeComment.id}/likes`)
            .set('X-Access-Token', testUserTwo.accessToken)
            .end((error, response) => {
              helpers.logExampleResponse(response);
              response.should.have.status(200);
              response.body.should.be.an('object');
              response.body.id.should.equal(scopedTrackCommentLike.id);
              done();
            });
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/tracks/1/comments/1/likes');
  });

  /*
   * DELETE
   */

  describe('DELETE /tracks/:trackId/comments/:trackCommentId/likes/:trackCommentLikeId', () => {
    it('204s and deletes track comment like', done => {
      chai.request(server)
        .delete(`/tracks/${testTrackThree.id}/comments/${testTrackThreeComment.id}/likes/${scopedTrackCommentLike.id}`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/tracks/3/comments/1/likes/1');
  });
});