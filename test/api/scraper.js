const fs = require('fs');
const helpers = require('../helpers');

describe ('Scraper', () => {
  /*
   * POST
   */

  describe('POST /scraper', () => {
    it('200s with metadata when provided soundcloud url and html', done => {
      const fields = {
        html: fs.readFileSync('./test/soundcloud.html', 'utf8'),
        url: 'https://soundcloud.com/thisisnull/lil-hip-hop-beat',
      };

      chai.request(server)
        .post('/scraper')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          done();
        });
    });

    it('200s with metadata when provided youtube url and html', done => {
      const fields = {
        html: fs.readFileSync('./test/youtube.html', 'utf8'),
        url: 'https://www.youtube.com/watch?v=0psna57Z7-g',
      };

      chai.request(server)
        .post('/scraper')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          done();
        });
    });
  });
});