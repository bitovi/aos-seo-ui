var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var exportId = require('./generate-file-export-id.json');

require('can/util/fixture/fixture');

can.fixture('GET ' + envVars.apiUrl() + '/generate-export-id.json', function (req, res) {
    res(200, 'success', exportId);
});
