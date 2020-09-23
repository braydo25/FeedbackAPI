const util = require('util');

/*
 * Helpers
 */

module.exports.it401sWhenUserAuthorizationIsInvalid = (method, route) => {
  it('401s when user authorization is invalid', done => {
    chai.request(server)[method](route)
      .set('X-Access-Token', 'some bad token')
      .end((error, response) => {
        response.should.have.status(401);
        done();
      });
  });
};

module.exports.logExampleResponse = response => {
  if (!enableTestResponseLogging) {
    return;
  }

  const logHeader = `--- ${response.request.method.toUpperCase()} ${response.request.url} | API Response (${response.status}) ---`;
  const logFooter = `VVV${'-'.repeat(logHeader.length - 3)}`;

  console.log(`\n\n\t${logHeader}`);
  for (let i = 0; i < 4; i++) { console.group(); }
  console.log(util.inspect(response.body, true, 10));
  for (let i = 0; i < 4; i++) { console.groupEnd(); }
  console.log(`\t${logFooter}`);
};
