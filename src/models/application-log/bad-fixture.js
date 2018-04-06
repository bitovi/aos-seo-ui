var fixture = require('can-fixture');
var bad = require('../bad-server-response');
var envVars = require('seo-ui/utils/environmentVars');
require('can-fixture');

fixture('POST ' + envVars.apiUrl() + '/log.json', bad);
