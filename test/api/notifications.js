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
          response.body.length.should.be.at.least(1);
          response.body.forEach(notification => {
            notification.should.have.property('createdAt');

            if (notification.trackComment) {
              notification.trackComment.should.be.an('object');
              notification.trackComment.id.should.be.a('number');
              notification.trackComment.text.should.be.a('string');
              notification.trackComment.time.should.be.a('number');
              notification.trackComment.should.have.property('createdAt');
              notification.trackComment.track.should.be.an('object');
              notification.trackComment.track.id.should.be.a('number');
              notification.trackComment.track.name.should.be.a('string');
              notification.trackComment.track.mp3Url.should.be.a('string');
              notification.trackComment.user.id.should.be.a('number');
              notification.trackComment.user.should.have.property('name');
              notification.trackComment.user.should.have.property('avatarUrl');
            }

            if (notification.trackCommentLike) {
              notification.trackCommentLike.should.be.an('object');
              notification.trackCommentLike.id.should.be.a('number');
              notification.trackCommentLike.trackComment.text.should.be.a('string');
              notification.trackCommentLike.trackComment.time.should.be.a('number');
              notification.trackCommentLike.user.id.should.be.a('number');
              notification.trackCommentLike.user.should.have.property('name');
              notification.trackCommentLike.user.should.have.property('avatarUrl');
            }
          });
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/notifications');
  });
});