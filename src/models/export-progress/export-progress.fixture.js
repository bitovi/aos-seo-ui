var fixture = require('can-fixture');
var envVars = require('seo-ui/utils/environmentVars');
require('can-fixture');

fixture('GET ' + envVars.apiUrl() + '/export-progress.json', function (req, res) {
    if (!req.data.exportId) {
        return res(500, 'error', {
            state: 'ERROR',
            message: 'some error message'
        });
    }

    if (req.data.state === 'error') {
        return res(200, 'error', {
            state: 'error',
            message: 'some error message'
        });
    }

    res(200, 'success', {
        state: 'success',
        message: 'some message'
    });
});
