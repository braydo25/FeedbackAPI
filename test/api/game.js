const helpers = require('../helpers');

describe('Game', () => {
  /*
   * GET
   */

  describe('GET /game', () => {
    it('200s with an array of tracks the user has not commented on', done => {
      chai.request(server)
        .get('/game')
        .set('X-Access-Token', testUserTwo.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.forEach(track => {
            track.id.should.be.a('number');
            track.name.should.be.a('string');
            track.should.have.property('description');
            track.originalUrl.should.be.a('string');
            track.mp3Url.should.be.a('string');
            track.sampleRate.should.be.a('number');
            track.waveform.should.be.an('array');
            track.waveform.length.should.be.at.least(1);
            track.duration.should.be.a('number');
            track.genre.should.be.an('object');
            track.genre.name.should.be.a('string');
            track.user.should.be.an('object');
            track.user.id.should.be.a('number');
            track.user.should.have.property('avatarUrl');
            track.user.should.have.property('name');
          });
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/game');
  });
});