require('can/util/fixture/fixture');

var can = require('can');

var envVars = require('seo-ui/utils/environmentVars');
var urlFilters = require('./url-filters.json');

// getFilters
can.fixture('GET ' + envVars.apiUrl() + '/url-filters.json', function (request, response) {
    response(urlFilters);
});
