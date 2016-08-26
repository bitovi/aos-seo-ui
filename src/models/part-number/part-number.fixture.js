require('can/util/fixture/fixture');

var can = require('can');

var envVars = require('seo-ui/utils/environmentVars');
var partNumbers = require('./part-numbers.json').data;

// Find All
can.fixture('GET ' + envVars.apiUrl() + '/part-numbers.json', function (request, response) {
    var requestData = request.data;
    var results = partNumbers;

    // Auto-Complete Search
    if (requestData && requestData.partNumber) {
        results = partNumbers.filter(function (item) {
            return item.partNumber.toLowerCase().indexOf(requestData.partNumber.toLowerCase()) !== -1;
        });
    }

    response(results);
});
