const helpers = require('../../helpers');

describe('Track Comments', () => {
  /*
   * POST
   */

  describe('POST /tracks/:trackId/comments', () => {
    it('200s with created track comment', done => {
      done();
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/tracks/1/comments');
  });

  /*
   * DELETE
   */

  describe('DELETE /tracks/:trackId/comments/:trackCommentId', () => {
    it('204s and deletes track comment', done => {
      done();
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/tracks/1/comments/1');
  });
});