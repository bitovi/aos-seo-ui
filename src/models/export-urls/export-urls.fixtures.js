var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
require('can/util/fixture/fixture');

can.fixture('POST ' + envVars.apiUrl() + '/export-urls.json', function (req, res) {
    res(200, 'success', 'demoFile.csv');
});
