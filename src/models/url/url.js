require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var formatDate = require('@apple/pui/utils/formatDate');
var guid = require('@apple/pui/utils/guid');

module.exports = can.Model.extend(
    {
        findAll: 'GET ' + envVars.apiUrl() + '/urls.json',
        findOne: 'GET ' + envVars.apiUrl() + '/urls/{url}.json',

        getFilters: function () {
            var url = envVars.apiUrl() + '/url-filters.json';

            return can.ajax({
                url: url,
                method: 'get',
                dataType: 'json',
                contentType: 'application/json'
            });
        }
    },
    {
        define: {
            country: {
                type: 'string'
            },

            createDate: {
                type: function (value) {
                    return formatDate(value);
                }
            },

            description: {
                type: 'string'
            },

            descriptionAnatomy: {
                value: []
            },

            guid: {
                get: function () {
                    return guid();
                },
                serialize: false
            },

            modifyDate: {
                type: function (value) {
                    return formatDate(value);
                }
            },

            pageTitle: {
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

            storeFrontAlias: {
                type: 'string'
            },

            titleAnatomy: {
                value: []
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
