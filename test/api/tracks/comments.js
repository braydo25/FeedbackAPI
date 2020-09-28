const helpers = require('../../helpers');

describe('Track Comments', () => {
  let scopedTrackComment = null;

  /*
   * POST
   */

  describe('POST /tracks/:trackId/comments', () => {
    it('200s with created track comment', done => {
      const fields = {
        text: 'this is awesome! Love everything about this track.',
        time: 123,
      };

      chai.request(server)
        .post(`/tracks/${testTrackOne.id}/comments`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.trackId.should.equal(testTrackOne.id);
          response.body.userId.should.equal(testUserTwo.id);
          response.body.text.should.equal(fields.text);
          scopedTrackComment = response.body;
          done();
        });
    });

    it('400s when requesting user is creator of track', done => {
      const fields = {
        text: 'this is a test yo yo yo!',
        time: 16,
      };

      chai.request(server)
        .post(`/tracks/${testTrackOne.id}/comments`)
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/tracks/1/comments');
  });

  /*
   * DELETE
   */

  describe('DELETE /tracks/:trackId/comments/:trackCommentId', () => {
    it('204s and deletes track comment', done => {
      chai.request(server)
        .delete(`/tracks/${testTrackOne.id}/comments/${scopedTrackComment.id}`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/tracks/1/comments/1');
  });
});