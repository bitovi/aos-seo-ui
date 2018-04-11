var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

require('can/map/define/');

module.exports = can.Model.extend({
    findAll: 'GET ' + envVars.apiUrl() + '/request-list.json',
    findOne: envVars.apiUrl() + '/notifications/{id}.json'
}, {});
