const helpers = require('../helpers');

describe('Game', () => {
  /*
   * GET
   */

  describe('GET /game', () => {
    it('200s with an array of tracks the user has not commented on', done => {
      done();
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/game');
  });
});