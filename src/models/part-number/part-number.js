var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Model.extend(
    {
        findAll: 'GET ' + envVars.apiUrl() + '/part-numbers.json'
    },
    {}
);
