var fixture = require('can-fixture');
var bad = require('../bad-server-response');
var envVars = require('seo-ui/utils/environmentVars');
require('can-fixture');

fixture('GET ' + envVars.apiUrl() + '/urls/{url}.json', bad);
fixture('GET ' + envVars.apiUrl() + '/url-filters.json', bad);
