var can = require('can');

var Model = require('models/url/url.js');
var rowTemplate = require('./row.stache');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array{Object}} columns
         * @description The list of columns (key name, header label, column width) used by the Grid List.
         */
        columns: {
            value: [
                {
                    cssClass: 'col-md-2',
                    key: 'partNumber',
                    label: 'Part Number'
                },
                {
                    cssClass: 'col-md-4',
                    key: 'url',
                    label: 'URL'
                },
                {
                    cssClass: 'col-md-3',
                    key: 'pageTitle',
                    label: 'Page Title'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'segment',
                    label: 'Segment'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'region',
                    label: 'Region'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'country',
                    label: 'Country'
                }
            ]
        },

        /**
         * @property {Array{Object}} dataOptions
         * @description A list of search-able keys/columns, used by the Grid Search component.
         */
        dataOptions: {
            value: [
                {
                    key: 'url',
                    label: 'URL'
                },
                {
                    key: 'pageTitle',
                    label: 'Page Title'
                },
                {
                    key: 'partNumber',
                    label: 'Part Number'
                }
            ]
        },

        /**
         * @property {can.Model} model
         * @description The model used by the view.
         */
        model: {
            get: function () {
                return Model;
            }
        },

        /**
         * @property {function} rowTemplate
         * @description Stores the template renderer function reference.
         */
        rowTemplate: {
            value: function () {
                return function () {
                    return rowTemplate;
                };
            }
        },

        /**
         * @property {String} searchField
         * @description The initial search key.
         */
        searchField: {
            type: 'string',
            value: 'url'
        },

        /**
         * @property {String} title
         * @description The page's main header/title.
         */
        title: {
            type: 'string',
            value: 'URLs'
        }
    }
});
