const helpers = require('../helpers');

describe('Notifications', () => {
  /*
   * GET
   */

  describe('GET /notifications', () => {
    it('200s with an array of notifications', done => {
      chai.request(server)
        .get('/notifications')
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.forEach(notification => {
            notification.should.have.property('createdAt');
            notification.trackComment.should.be.an('object');
            notification.trackComment.id.should.be.a('number');
            notification.trackComment.text.should.be.a('string');
            notification.trackComment.time.should.be.a('number');
            notification.trackComment.should.have.property('createdAt');
            notification.trackComment.user.id.should.be.a('number');
            notification.trackComment.user.name.should.be.a('string');
            notification.trackComment.user.should.have.property('avatarUrl');
            notification.trackComment.track.should.be.an('object');
            notification.trackComment.track.id.should.be.a('number');
            notification.trackComment.track.name.should.be.a('string');
            notification.trackComment.track.mp3Url.should.be.a('string');
          });
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/notifications');
  });
});