var can = require('can');
var environmentVars = require('seo-ui/utils/environmentVars');

require('can/util/fixture/fixture');

can.fixture('POST ' + environmentVars.apiUrl() + '/process-for-textarea-input.json', function () {
    return 'temp.csv';
});
