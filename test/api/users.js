const fs = require('fs');
const helpers = require('../helpers');

describe('Users', () => {
  let scopedUser = null;

  /*
   * POST
   */

  describe('POST /users', () => {
    it('200s with created user', done => {
      const fields = {
        email: 'me@braydonb.com',
      };

      chai.request(server)
        .post('/users')
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.not.have.property('password');
          scopedUser = response.body;
          done();
        });
    });

    it('200s with existing user when provided correct password', done => {
      const fields = {
        email: testUserOne.email,
        password: testUserOne.password,
      };

      chai.request(server)
        .post('/users')
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.not.have.property('password');
          done();
        });
    });

    it('403s when provided an email and incorrect password', done => {
      const fields = {
        email: testUserOne.email,
        password: 'badpassword',
      };

      chai.request(server)
        .post('/users')
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(403);
          done();
        });
    });
  });

  /*
   * PATCH
   */

  describe('PATCH /users/me', () => {
    it('200s with updated user object', done => {
      const fields = {
        name: 'new name boiii',
        password: '123abcdef',
        preferredGenreIds: [ 1, 5, 7 ],
      };

      chai.request(server)
        .patch('/users/me')
        .send(fields)
        .set('X-Access-Token', scopedUser.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.name.should.equal(fields.name);
          response.body.should.not.have.property('password');
          response.body.preferredGenreIds.should.deep.equal(fields.preferredGenreIds);
          done();
        });
    });

    it('200s with updated user object when provided avatar image', done => {
      const fields = {
        preferredGenreIds: [ 1, 4, 2 ],
      };

      chai.request(server)
        .patch('/users/me')
        .set('X-Access-Token', testUserOne.accessToken)
        .field('preferredGenreIds', fields.preferredGenreIds)
        .attach('avatar', fs.readFileSync('./test/profile.jpg'), 'avatar.jpg')
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.avatarUrl.should.not.equal(null);
          response.body.preferredGenreIds.should.deep.equal(fields.preferredGenreIds);
          done();
        });
    });

    it('400s when provided preferredGenreIds that are not integers', done => {
      const fields ={
        preferredGenreIds: [ '1', '2', '3' ],
      };

      chai.request(server)
        .patch('/users/me')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/users/me');
  });
});