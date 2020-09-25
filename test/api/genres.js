const helpers = require('../helpers');

describe('Genres', () => {
  /*
   * GET
   */

  describe('GET /genres', () => {
    it('200s with an array of genres', done => {
      chai.request(server)
        .get('/genres')
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(genre => {
            genre.should.have.property('id');
            genre.should.have.property('name');
            genre.should.have.property('description');
          });
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/genres');
  });
});
