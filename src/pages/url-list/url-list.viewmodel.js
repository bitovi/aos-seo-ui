var can = require('can');

var FilterModel = require('seo-ui/models/url-filter/url-filter');
var Model = require('seo-ui/models/url/url');
var rowTemplate = require('./row.stache');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array<can.Map>} url-list.viewModel.actionBar actionBar
         * @description Function wrappers for the action bar component.
         */
        actionBar: {
            Value: Array,
            get: function () {
                var actionBar = [];

                actionBar.push({
                    dropDowns: [
                        {
                            label: 'Export Nemo-Ready File'
                        },
                        {
                            label: 'Export Current View (.CSV)'
                        }
                    ],
                    title: 'Export',
                    type: 'download'
                });

                return actionBar;
            }
        },

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
                    label: 'Description',
                    isHidden: true
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
                    label: 'Part Number'
                }
            ]
        },

        /**
         * @property {Array<Object>} filterConfig filterConfig
         * @description Configuration of filters to use.
         */
        filterConfig: {
            value: [
                {
                    btnLabel: 'All Segments',
                    parameter: 'segments'
                },
                {
                    btnLabel: 'All Regions',
                    parameter: 'regions',
                    secondaryParameter: 'countries'
                },
                {
                    btnLabel: 'All Statuses',
                    parameter: 'statuses'
                },
                {
                    btnLabel: 'All Dates',
                    parameter: 'dateRanges'
                }
            ]
        },

        /**
         * @property {Object|can.Map} filterModel filterModel
         * @description The filter model.
         */
        filterModel: {
            get: function () {
                return FilterModel;
            }
        },

        /**
         * @property {can.Model} url-list.viewModel.model model
         * @description The model used by the view.
         */
        model: {
            get: function () {
                return Model;
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
