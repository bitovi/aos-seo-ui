var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
require('can/util/fixture/fixture');


can.fixture('GET ' + envVars.apiUrl() + '/export-progress/export-progress.json', function (req, res) {

    if (!req.data.exportId) {
        return res(500, 'error', {
            "state": "ERROR",
            "message": "some error message"
        });
    }

    if (req.data.exportId === 'error') {
        return res(200, 'success', {
            "state": "ERROR",
            "message": "some error message"
        });
    }

    res(200, 'success', {
        "state": "SUCCESS",
        "message": "some message"
    });
});
