var can = require('can');
var environmentVars = require('seo-ui/utils/environmentVars');

require('can/util/fixture/fixture');

can.fixture('POST ' + environmentVars.apiUrl() + '/process-csv-url.json', function () {
    return 'temp.csv';
});
