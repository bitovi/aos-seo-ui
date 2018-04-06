var fixture = require('can-fixture');
var envVars = require('seo-ui/utils/environmentVars');
var exportId = require('./generate-file-export-id.json');

require('can-fixture');

fixture('GET ' + envVars.apiUrl() + '/generate-export-id.json', function (req, res) {
    res(200, 'success', exportId);
});
