require('can-map-define');

var ajax = require('can-util/dom/ajax/ajax');

var Model = require('can-model');

var envVars = require('seo-ui/utils/environmentVars');
var formatDate = require('@apple/pui/dist/cjs/utils/formatDate');
var guid = require('@apple/pui/dist/cjs/utils/guid');

module.exports = Model.extend(
    {
        findAll: 'GET ' + envVars.apiUrl() + '/urls.json',
        findOne: 'GET ' + envVars.apiUrl() + '/urls/{url}.json',

        getFilters: function () {
            var url = envVars.apiUrl() + '/url-filters.json';
            return ajax({
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
