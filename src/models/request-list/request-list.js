var can = require('can');
require('can/map/define/');
var $ = require('jquery');
var envVars = require('seo-ui/utils/environmentVars');


module.exports = can.Model.extend({
        findAll: 'GET ' + envVars.apiUrl() + '/request-list.json',
    }
);


