var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

require('can/map/define/');

module.exports = can.Model.extend({
    findAll: 'GET ' + envVars.apiUrl() + '/notifications.json',
    findOne: envVars.apiUrl() + '/notifications/{id}.json'
}, {});
