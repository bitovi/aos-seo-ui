var Model = require('can-model');
var envVars = require('seo-ui/utils/environmentVars');

require('can-map-define');

module.exports = Model.extend({
    findAll: 'GET ' + envVars.apiUrl() + '/notifications.json',
    findOne: envVars.apiUrl() + '/notifications/{id}.json'
}, {});
