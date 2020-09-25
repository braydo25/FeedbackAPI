const helpers = require('../../helpers');

describe('Track Plays', () => {
  /*
   * POST
   */

  describe('POST /tracks/:trackId/comments', () => {
    it('204s and creates a track play row in the database', done => {
      chai.request(server)
        .post(`/tracks/${testTrackOne.id}/plays`)
        .set('X-Access-Token', testUserTwo.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/tracks/1/comments');
  });
});