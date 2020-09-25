const fs = require('fs');
const helpers = require('../helpers');

describe('Tracks', () => {
  let scopedTrack = null;

  /*
   * POST
   */

  describe('POST /tracks', () => {
    it('200s with created track', done => {
      const fields = {
        genreId: 6,
        name: 'Stars Tonight',
        description: 'Fun work I did with blah blah blah!',
      };

      chai.request(server)
        .post('/tracks')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('id');
          response.body.genreId.should.equal(fields.genreId);
          response.body.name.should.equal(fields.name);
          response.body.description.should.equal(fields.description);
          scopedTrack = response.body;
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/tracks');
  });

  /*
   * GET
   */

  describe('GET /tracks', () => {
    it('200s with created tracks for authorized user', done => {
      done();
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/tracks');
  });

  /*
   * PATCH
   */

  describe('PATCH /tracks/:trackId', () => {
    let scopedUpdatedTrack = null;

    it('200s with updated track', done => {
      const fields = {
        genreId: 7,
        name: 'this is a name change!',
        description: 'a new description yo',
      };

      chai.request(server)
        .patch(`/tracks/${scopedTrack.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.genreId.should.equal(fields.genreId);
          response.body.name.should.equal(fields.name);
          response.body.description.should.equal(fields.description);
          done();
        });
    });

    it('200s with updated track when provided audio file', done => {
      chai.request(server)
        .patch(`/tracks/${scopedTrack.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .attach('audio', fs.readFileSync('./test/song.mp3'), 'song.mp3')
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.checksum.should.be.a('string');
          response.body.originalUrl.should.be.a('string');
          response.body.mp3Url.should.be.a('string');
          response.body.sampleRate.should.be.a('number');
          response.body.duration.should.be.a('number');
          response.body.waveform.should.be.an('array');
          response.body.waveform.length.should.be.at.least(1);
          scopedUpdatedTrack = response.body;
          done();
        });
    });

    it('200s but does not update audio when an audio file has already been provided', done => {
      chai.request(server)
        .patch(`/tracks/${scopedTrack.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .attach('audio', fs.readFileSync('./test/song.mp3'), 'song.mp3')
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.originalUrl.should.equal(scopedUpdatedTrack.originalUrl);
          response.body.mp3Url.should.equal(scopedUpdatedTrack.mp3Url);
          done();
        });
    });

    it('400s when provided duplicate audio file', done => {
      done();
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/tracks/1');
  });

  /*
   * DELETE
   */

  describe('DELETE /tracks/:trackId', () => {
    it('204s and deletes track', done => {
      done();
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/tracks/1');
  });
});