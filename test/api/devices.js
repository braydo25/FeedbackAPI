const helpers = require('../helpers');

const androidDetails = {
  isDevice: true,
  brand: 'Google',
  manufacturer: 'Google',
  modelName: 'pixel',
  modelId: 'pixel',
  designName: 'googlepixel',
  productName: 'pixel',
  deviceYearClass: '2019',
  totalMemory: '111024400',
  supportedCpuArchitectures: [ 'arm64' ],
  osName: 'android',
  osVersion: '8',
  osBuildId: '27',
  osInternalBuildId: '27',
  osBuildFingerprint: 'awud3h8adhau3bhaf',
  platformApiLevel: null,
  deviceName: 'bbandroid',
};

const iosDetails = {
  isDevice: true,
  brand: 'Apple',
  manufacturer: 'Apple',
  modelName: 'iPhone 11',
  modelId: 'iphone11xr',
  designName: 'iphone',
  productName: 'iphone',
  deviceYearClass: '2019',
  totalMemory: '11100000',
  supportedCpuArchitectures: [ 'armv7' ],
  osName: 'ios',
  osVersion: '14',
  osBuildId: '11',
  osInternalBuildId: '11',
  osBuildFingerprint: 'auwdhauhd3da3d',
  platformApiLevel: null,
  deviceName: 'bbiphone',
};

describe('Devices', () => {
  /*
   * PUT
   */

  describe('PUT /devices', () => {
    it('204s when provided details and uuid', done => {
      const fields = {
        uuid: '1234',
        details: androidDetails,
      };

      chai.request(server)
        .put('/devices')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    it('204s when provided existing uuid and new fcmRegistrationId', done => {
      const fields = {
        uuid: '1234',
        fcmRegistrationId: 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1',
        details: androidDetails,
      };

      chai.request(server)
        .put('/devices')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    it('204s when provided details and existing uuid', done => {
      const fields = {
        uuid: '1234',
        details: androidDetails,
      };

      chai.request(server)
        .put('/devices')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    it('204s when provided details and apnsToken', done => {
      const fields = {
        uuid: '2345',
        apnsToken: '2a31d914734970edf68b5da67403f09c8007996d775f1880480f2dc5f1d5c883',
        details: iosDetails,
      };

      chai.request(server)
        .put('/devices')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    it('204s when provided details and existing apnsToken', done => {
      const fields = {
        uuid: '2345',
        apnsToken: '2a31d914734970edf68b5da67403f09c8007996d775f1880480f2dc5f1d5c883',
        details: iosDetails,
      };

      chai.request(server)
        .put('/devices')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    it('400s when not provided uuid', done => {
      const fields = {
        details: androidDetails,
      };

      chai.request(server)
        .put('/devices')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('put', '/devices');
  });
});
