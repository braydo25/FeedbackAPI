/*
 * This controls test execution order.
 */

require('./api/health');
require('./api/users');
require('./api/tracks');
require('./api/tracks/comments');
require('./api/game');
