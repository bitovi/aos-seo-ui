require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var formatDate = require('pui/utils/formatDate');

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
                type: function (value) {
                    var descriptionAnatomy = this.attr('descriptionAnatomy');

                    return descriptionAnatomy && descriptionAnatomy.length ? descriptionAnatomy : value;
                }
            },

            descriptionAnatomy: {
                value: []
            },

            modifyDate: {
                type: function (value) {
                    return formatDate(value);
                }
            },

            pageTitle: {
                type: function (value) {
                    var titleAnatomy = this.attr('titleAnatomy');

                    return titleAnatomy && titleAnatomy.length ? titleAnatomy : value;
                }
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
