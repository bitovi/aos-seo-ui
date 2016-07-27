var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
require('can/util/fixture/');

can.fixture('POST ' + envVars.apiUrl() + '/log.json', function (req, res) {
    res(200, 'log entry created');
});
