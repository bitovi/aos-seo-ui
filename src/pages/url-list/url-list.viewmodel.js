var can = require('can');

var PartNumberModel = require('seo-ui/models/part-number/part-number');
var rowTemplate = require('./row.stache');
var UrlModel = require('seo-ui/models/url/url');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array<can.Map>} url-list.viewModel.columns columns
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
                    cssClass: 'col-md-2',
                    key: 'url',
                    label: 'URL'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'pageTitle',
                    label: 'Page Title'
                },
                {
                    cssClass: 'col-md-3',
                    key: 'description',
                    label: 'Description'
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
                },
                {
                    cssClass: 'col-md-2',
                    key: 'status',
                    label: 'Status'
                }
            ]
        },

        /**
         * @property {Number} url-list.viewmodel.count count
         * @description The number of records being returned.
         */
        count: {
            value: 0,
            type: 'number'
        },

        /**
         * @property {Array<can.Map>} url-list.viewModel.dataOptions dataOptions
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
                    label: 'Part Number',
                    autocomplete: {
                        'character-delay': 2,
                        'key-name': 'partNumber',
                        'model': 'partNumberModel'
                    }
                }
            ]
        },

        /**
         * @property {can.Model} url-list.viewModel.urlModel urlModel
         * @description The model used to retrieve and display a list of URLs.
         */
        urlModel: {
            get: function () {
                return UrlModel;
            }
        },

        /**
         * @property {String} url-list.viewModel.pageTitle pageTitle
         * @description The page's main header/title.
         */
        pageTitle: {
            type: 'string',
            value: 'URLs'
        },

        /**
         * @property {can.Model} url-list.viewModel.partNumberModel partNumberModel
         * @description A model used for search auto-complete.
         */
        partNumberModel: {
            get: function () {
                return PartNumberModel;
            }
        },

        /**
         * @property {function} url-list.viewModel.rowTemplate rowTemplate
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
         * @property {String} url-list.viewModel.searchField searchField
         * @description The initial search key.
         */
        searchField: {
            type: 'string',
            value: 'url'
        }
    }
});
