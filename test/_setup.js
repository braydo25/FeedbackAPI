/*
 * Import Environment variables
 */

require('dotenv').config();

/*
 * Dependencies
 */

const fs = require('fs');

/*
 * Set Globals
 */

global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = `http://localhost:${process.env.PORT}`;

global.enableTestResponseLogging = true;


global.testUserOne = {
  email: 'test@test.com',
  password: 'test123',
};

global.testUserTwo = {
  email: 'test2@test2.com',
  password: 'test456',
};

global.testTrackOne = {
  genreId: 14,
  name: 'Fighting Demons (Null Remix)',
  description: 'This was a fun project. I love juice wrlds music and wanted to rework fighting demons.',
};

/*
 * Configure Chai
 */

chai.should();
chai.use(chaiHttp);

/*
 * Setup Test Environment
 */

const waitPort = require('wait-port');
const Sequelize = require('sequelize');
const {
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_WRITE_HOST,
  MYSQL_PORT,
} = process.env;

before(done => {
  (async () => {
    fatLog('Waiting for API Server...');
    await waitPort({
      host: 'localhost',
      port: parseInt(process.env.PORT),
    });

    fatLog('Preparing for DB connection...');
    const database = new Sequelize(MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, {
      dialect: 'mysql',
      host: MYSQL_WRITE_HOST,
      port: MYSQL_PORT,
    });

    fatLog('Testing DB Connection...');
    await database.authenticate();

    fatLog('Truncating DB...');
    await database.transaction(transaction => {
      return database.query('SET FOREIGN_KEY_CHECKS = 0', { transaction }).then(() => {
        return database.query(
          `SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';')
          FROM INFORMATION_SCHEMA.TABLES
          WHERE table_schema in ('${MYSQL_DATABASE}');`,
          { transaction },
        );
      }).then(results => {
        let truncatePromises = [];

        results[0].forEach(result => {
          Object.keys(result).forEach(key => {
            truncatePromises.push(database.query(result[key], { transaction }));
          });
        });

        return Promise.all(truncatePromises);
      });
    });

    fatLog('Creating genres...');
    await Promise.all([
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Alternative Rock", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Ambient", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Classical", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Cinema", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Country", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Dance & EDM", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Dancehall", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Deep House", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Disco", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Drum & Bass", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Dubstep", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Electronic", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Folk & Singer-Songwriter", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Hip-Hop & Rap", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("House", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Indie", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Jazz & Blues", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Latin", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Metal", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Piano", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Pop", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("R&B & Soul", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Reggae", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Reggaeton", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Rock", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Techno", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Trance", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Trap", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("Triphop", NOW(), NOW())'),
      database.query('INSERT INTO genres (name, updatedAt, createdAt) VALUES("World", NOW(), NOW())'),
    ]);

    fatLog('Creating global test user one...');
    const createdTestUserOneResponse = await chai.request(server).post('/users').send(testUserOne);
    testUserOne = { ...createdTestUserOneResponse.body, ...testUserOne };

    fatLog('Setting password for test user one...');
    await chai.request(server)
      .patch('/users/me')
      .set('X-Access-Token', testUserOne.accessToken)
      .send({ password: testUserOne.password });

    fatLog('Creating global test user two...');
    const createdTestUserTwoResponse = await chai.request(server).post('/users').send(testUserTwo);
    testUserTwo = { ...createdTestUserTwoResponse.body, ...testUserTwo };

    fatLog('Setting password for test user two...');
    await chai.request(server)
      .patch('/users/me')
      .set('X-Access-Token', testUserTwo.accessToken)
      .send({ password: testUserTwo.password });

    fatLog('Creating global test track one...');
    const createdTestTrackOneResponse = await chai.request(server)
      .post('/tracks')
      .set('X-Access-Token', testUserOne.accessToken)
      .send(testTrackOne);
    testTrackOne = { ...createdTestTrackOneResponse.body, ...testTrackOne };

    fatLog('Uploading audio for global test track one...');
    await chai.request(server)
      .patch(`/tracks/${testTrackOne.id}`)
      .set('X-Access-Token', testUserOne.accessToken)
      .attach('audio', fs.readFileSync('./test/song.mp3'), 'song.mp3');

    done();
  })();
});

/*
 * Helpers
 */

function fatLog(message) {
  let divider = Array(message.length + 1).join('=');

  console.log('\n');
  console.log(divider);
  console.log(message);
  console.log(divider);
  console.log('\n');
}
