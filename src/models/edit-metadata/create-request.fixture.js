require('can/util/fixture/fixture');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

can.fixture('POST ' + envVars.apiUrl() + '/notifications/create.json', function (req, res) {
    var notification = req.data;

    if (!notification) {
        res(404, 'Not able to create request');
    }

    res(200, 'notification created, notification id' + res.id);
});
