const helpers = require('../helpers');

describe('Users', () => {
  /*
   * POST
   */

  describe('POST /users', () => {
    it('200s with created user', done => {
      done();
    });

    it('204s with existing user when provided correct password', done => {
      done();
    });

    it('400s when provided and email and incorrect password', done => {
      done();
    });
  });

  /*
   * PATCH
   */

  describe('PATCH /users/me', () => {
    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/users/me');
  });
});