var Model = require('can-model');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = Model.extend(
    {
        findAll: 'GET ' + envVars.apiUrl() + '/part-numbers.json'
    },
    {}
);
