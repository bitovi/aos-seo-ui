var fixture = require('can-fixture');
var envVars = require('seo-ui/utils/environmentVars');
require('can-fixture');

fixture('POST ' + envVars.apiUrl() + '/export-urls.json', function (req, res) {
    res(200, 'success', 'demoFile.csv');
});
