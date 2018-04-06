require('can-fixture');

var fixture = require('can-fixture');

var envVars = require('seo-ui/utils/environmentVars');
var createRequestResponse = require('./create-request.json');
var notificationDetails = require('./notification-details.json');

fixture('POST ' + envVars.apiUrl() + '/notifications/create.json', function (req, res) {
    var notification = req.data;

    if (!notification) {
        res(404, 'Not able to create request');
    }
    return createRequestResponse;
});

fixture('GET ' + envVars.apiUrl() + '/notifications/{id}.json', function () {
    return notificationDetails;
});
