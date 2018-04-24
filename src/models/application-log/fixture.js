var fixture = require('can-fixture');
var envVars = require('seo-ui/utils/environmentVars');
require('can-fixture');

fixture('POST ' + envVars.apiUrl() + '/log.json', function (req, res) {
    res(200, 'log entry created');
});
