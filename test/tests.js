/*
 * This controls test execution order.
 */

require('./api/health');
require('./api/genres');
require('./api/users');
require('./api/tracks');
require('./api/tracks/comments');
require('./api/tracks/plays');
require('./api/game');
require('./api/devices');