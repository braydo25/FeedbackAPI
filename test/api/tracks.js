const fs = require('fs');
const helpers = require('../helpers');

describe('Tracks', () => {
  let scopedTrack = null;

  /*
   * POST
   */

  describe('POST /tracks', () => {
    it('200s with created track', done => {
      chai.request(server)
        .post('/tracks')
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.id.should.be.a('number');
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
    it('200s with an array of created tracks for authorized user', done => {
      chai.request(server)
        .get('/tracks')
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(track => {
            track.should.be.an('object');
            track.should.have.property('name');
            track.should.have.property('description');
            track.should.have.property('originalUrl');
            track.should.have.property('mp3Url');
            track.should.have.property('checksum');
            track.should.have.property('sampleRate');
            track.should.have.property('waveform');
            track.should.have.property('duration');
            track.should.have.property('totalComments');
            track.should.have.property('totalPlays');
            track.should.have.property('user');

            if (track.genre) {
              track.genre.should.have.property('name');
              track.genre.should.have.property('description');
            }

            track.trackComments.should.be.an('array');
            track.trackComments.forEach(trackComment => {
              trackComment.should.have.property('id');
              trackComment.should.have.property('text');
              trackComment.should.have.property('time');
              trackComment.should.have.property('createdAt');
              trackComment.user.should.have.property('id');
              trackComment.user.should.have.property('name');
              trackComment.user.should.have.property('avatarUrl');
            });
          });
          done();
        });
    });

    it('200s with track when provided trackId', done => {
      chai.request(server)
        .get(`/tracks/${testTrackOne.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('name');
          response.body.should.have.property('description');
          response.body.should.have.property('originalUrl');
          response.body.should.have.property('mp3Url');
          response.body.should.have.property('checksum');
          response.body.should.have.property('sampleRate');
          response.body.should.have.property('waveform');
          response.body.should.have.property('duration');
          response.body.should.have.property('genre');
          response.body.should.have.property('user');
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/tracks');
  });

  /*
   * PATCH
   */

  describe('PATCH /tracks/:trackId', () => {
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
          response.body.genre.should.be.an('object');
          response.body.user.should.be.an('object');
          done();
        });
    });

    it('200s with updated track when provided audio file', done => {
      chai.request(server)
        .patch(`/tracks/${scopedTrack.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .attach('audio', fs.readFileSync('./test/song2.mp3'), 'song.mp3')
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
          response.body.genre.should.be.an('object');
          response.body.user.should.be.an('object');
          done();
        });
    });

    it('400s when provided duplicate audio file', done => {
      chai.request(server)
        .post('/tracks')
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          response.should.have.status(200);

          chai.request(server)
            .patch(`/tracks/${response.body.id}`)
            .set('X-Access-Token', testUserOne.accessToken)
            .attach('audio', fs.readFileSync('./test/song2.mp3'), 'song.mp3')
            .end((error, response) => {
              helpers.logExampleResponse(response);
              response.should.have.status(400);
              done();
            });
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/tracks/1');
  });

  /*
   * DELETE
   */

  describe('DELETE /tracks/:trackId', () => {
    it('204s and deletes track', done => {
      chai.request(server)
        .delete(`/tracks/${scopedTrack.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/tracks/1');
  });
});