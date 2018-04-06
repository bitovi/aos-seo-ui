require('can-fixture');

var fixture = require('can-fixture');

var envVars = require('seo-ui/utils/environmentVars');
var partNumbers = require('./part-numbers.json').data;

// Find All
fixture('GET ' + envVars.apiUrl() + '/part-numbers.json', function (request, response) {
    var requestData = request.data;
    var results = partNumbers;

    // Auto-Complete Search
    if (requestData && requestData.partNumber) {
        results = partNumbers.filter(function (item) {
            if (item.partNumber && requestData.partNumber) {
                return item.partNumber.toLowerCase().indexOf(requestData.partNumber.toLowerCase()) !== -1;
            }
        });
    }

    response(results);
});
