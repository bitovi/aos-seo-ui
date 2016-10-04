var can = require('can');
var bad = require('../bad-server-response');
var envVars = require('seo-ui/utils/environmentVars');
require('can/util/fixture/');

can.fixture('GET ' + envVars.apiUrl() + '/urls/{url}.json', bad);
can.fixture('GET ' + envVars.apiUrl() + '/url-filters.json', bad);
