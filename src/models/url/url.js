var can = require('can');

require('can/map/define/define');

module.exports = can.Model.extend(
    {
        findAll: 'GET {@API_URL}/urls.json',
        findOne: 'GET {@API_URL}/urls/{url}.json',
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
