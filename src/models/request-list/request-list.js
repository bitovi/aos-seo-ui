require('can/map/define/');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Model.extend({
        findAll: 'GET ' + envVars.apiUrl() + '/request-list.json',
    }
);


