var can = require('can');

require('can/map/define/define');
var envVars = require('seo-ui/utils/environmentVars');
module.exports = can.Model.extend(
    {
        findAll: 'GET'+ envVars.apiUrl() +'/urls.json',
        findOne: 'GET'+ envVars.apiUrl() +'/urls/{url}.json',
    },
    {
        define: {
            country: {
                type: 'string'
            },

            partNumber: {
                type: 'string'
            },

            pageTitle: {
                type: 'string'
            },

            region: {
                type: 'string'
            },

            segment: {
                type: 'string'
            },

            url: {
                type: 'string'
            }
        }
    }
);
