require('can/util/fixture/fixture');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var createRequestResponse = require('./create-request.json');
var notificationDetails = require('./notification-details.json');


can.fixture('POST ' + envVars.apiUrl() + '/notifications/create.json', function (req, res) {
    var notification = req.data;

    if (!notification) {
        res(404, 'Not able to create request');
    }
    return createRequestResponse;
});

can.fixture('GET ' + envVars.apiUrl() + '/notifications/{id}.json', function (req, res) {
    return notificationDetails;
});
