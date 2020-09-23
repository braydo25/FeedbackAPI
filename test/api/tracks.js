const helpers = require('../helpers');

describe('Tracks', () => {
  /*
   * POST
   */

  describe('POST /tracks', () => {
    it('200s with created track', done => {
      done();
    });

    it('400s when provided duplicate audio file', done => {
      done();
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
    it('200s with updated track', done => {
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