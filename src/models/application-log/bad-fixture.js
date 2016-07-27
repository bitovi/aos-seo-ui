var can = require('can');
var bad = require('../bad-server-response');
var envVars = require('seo-ui/utils/environmentVars');
require('can/util/fixture/');

can.fixture('POST ' + envVars.apiUrl() + '/log.json', bad);
