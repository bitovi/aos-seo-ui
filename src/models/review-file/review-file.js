require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Model.extend({
	findOne: 'POST ' + envVars.apiUrl() + '/process-csv-url.json'
},{});
