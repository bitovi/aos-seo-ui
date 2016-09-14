require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Model.extend(
    {
        findAll: 'GET ' + envVars.apiUrl() + '/urls.json',
        findOne: 'GET ' + envVars.apiUrl() + '/urls/{url}.json'
    },
    {
        define: {
            country: {
                type: 'string'
            },

            description: {
                type: 'string'
            },

            descriptionKeyPath: {
                type: 'string'
            },

            descriptionUrl: {
                type: 'string'
            },

            pageTitle: {
                type: 'string'
            },

            pageTitleKeyPath: {
                type: 'string'
            },

            pageTitleUrl: {
                type: 'string'
            },

            partNumber: {
                type: 'string'
            },

            region: {
                type: 'string'
            },

            segment: {
                type: 'string'
            },

            status: {
                type: 'string'
            },

            url: {
                type: 'string'
            },

            urlAspenLink: {
                type: 'string'
            }
        }
    }
);
