var can = require('can');

var _ = require('lodash');
var anatomyItemTemplate = require('./anatomy-item.stache');
var PartNumberModel = require('seo-ui/models/part-number/part-number');
var primaryHeaderTemplate = require('./primary-header.stache!');
var rowTemplate = require('./row.stache');
var UrlModel = require('seo-ui/models/url/url');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Function} url-list.viewModel.anatomyItem anatomyItem
         * @description Stores the template that renders an anatomy item.
         */
        anatomyItem: {
            value: function () {
                return anatomyItemTemplate;
            }
        },

        /**
         * @property {Array<can.Map>} url-list.viewModel.columns columns
         * @description The list of columns (key name, header label, column width) used by the Grid List.
         */
        columns: {
            value: [
                {
                    cssClass: 'col-md-1',
                    key: 'selectUrl',
                    label: 'select'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'partNumber',
                    label: 'Part #'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'url',
                    label: 'URL'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'createDate',
                    label: 'Created Date',
                    isHidden: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'modifyDate',
                    label: 'Modified Date',
                    isHidden: true
                },
                {
                    cssClass: 'col-md-4',
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
                    cssClass: 'col-md-1',
                    key: 'pageType',
                    label: 'Type'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'status',
                    label: 'Status'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'storeFrontAlias',
                    label: 'Store Front Alias'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'nemoReadyRecord',
                    label: 'Nemo',
                    isHidden: true
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

        selectedItems: {
            value: []
        },

        /**
         * @property {Number} url-list.viewmodel.selectUrlCount selectUrlCount
         * @description The number of rows is selected.
         */
        selectUrlCount: {
            value: 0,
            type: 'number',
            get: function () {
                if (this.attr('items')) {
                    return this.attr('selectedItems').attr('length');
                }
            },
            set: function (newVal) {
                return newVal < 0 ? 0 : newVal;
            }
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
                    key: 'description',
                    label: 'Description'
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
         * @property {Array<Object>} filterConfig filterConfig
         * @description Configuration of filters to use.
         */
        filterConfig: {
            value: [
                {
                    btnLabel: 'All Segments',
                    filterGroups: [
                        {
                            groupTitle: 'Segment:',
                            parameter: 'segments'
                        }
                    ]
                },
                {
                    btnLabel: 'All Regions',
                    filterGroups: [
                        {
                            groupTitle: 'Region:',
                            parameter: 'regions'
                        },
                        {
                            groupTitle: 'Country:',
                            parameter: 'countries'
                        }
                    ]
                },
                {
                    btnLabel: 'All Page Types',
                    filterGroups: [
                        {
                            groupTitle: 'Page Type:',
                            parameter: 'pageTypes'
                        }
                    ]
                },
                {
                    btnLabel: 'All Statuses',
                    filterGroups: [
                        {
                            groupTitle: 'Status:',
                            inputType: 'radio',
                            parameter: 'statuses'
                        }
                    ]
                },
                {
                    btnLabel: 'All Dates',
                    filterGroups: [
                        {
                            groupTitle: 'Date Range:',
                            inputType: 'radio',
                            parameter: 'dateRanges'
                        }
                    ]
                },
                {
                    btnLabel: 'Nemo Ready',
                    filterGroups: [
                        {
                            groupTitle: 'Nemo Ready:',
                            inputType: 'radio',
                            parameter: 'nemoReadyRecord'
                        }
                    ]
                }
            ]
        },

        /**
         * @property {String} url-list.viewModel.pageTitle pageTitle
         * @description The page's main header/title.
         */
        pageTitle: {
            type: 'string',
            value: 'SEO Metadata'
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
         * @property {function} url-list.viewModel.primaryHeaderTemplate primaryHeaderTemplate
         * @description Stores the template renderer function reference.
         */
        primaryHeaderTemplate: {
            value: function () {
                return function () {
                    return primaryHeaderTemplate;
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
         * @property {Array<can.Map>} url-list.viewModel.items
         * @description selects/deselects if the items were previously selected.
         */
        items: {
            set: function (newVal) {
                var self = this;
                var searchTerm;
                var itemIndex;
                if (self.attr('selectedItems').length > 0) {
                    newVal.map(function (item) {
                        searchTerm = item.attr('url');
                        itemIndex = _.findIndex(self.attr('selectedItems'), function(o) {
                            return o.url == searchTerm;
                        });

                        if (itemIndex  > -1) {
                            item.attr('selected', true);
                        }
                    });
                    return newVal;
                } else {
                    return newVal;
                }
            }
        },

        /**
         * @property {Boolean} url-list.viewModel.isAllSelected
         * @description Indicates if all options are selected.
         * @option Default `false`
         */
        isAllSelected: {
            type: 'boolean',
            get: function () {
                if (this.attr('items')) {
                    var selectedItemsCount = this.attr('items')
                        .filter(function (option) {
                            return option.attr('selected');
                        }).length;
                    return this.attr('items').attr('length') === selectedItemsCount;
                }
            }
        }
    },

    /**
     * @function url-list.viewModel.selectAllUrl
     * @description Toggles the selected state of all table rows.
     * @param {$el} retuns element
     * @param {evt} Determines if the checkbox will be selected or deselected
     */
    selectAllUrl: function ($el, evt) {
        var self = this;
        var toggleState = evt.context.checked;

        this.attr('items').map(function (option) {
            option.attr('selected', toggleState);
            if (toggleState) {
                self.attr('selectedItems').push(option);
            } else {
                self.attr('selectedItems').splice(_.findIndex(self.attr('selectedItems'), option), 1);
            }
        });
    },

    /**
     * @function url-list.viewModel.selectRowUrl
     * @description Toggles the selected rows.
     * @param {evt} Determines if the checkbox will be selected or deselected
     */
    selectRowUrl: function(url, evt) {
        var self = this;
        var toggleState = evt.currentTarget.checked;

        this.attr('items').map(function (option) {
            if (option.url === url) {
                option.attr('selected', toggleState);

                if (toggleState) {
                    self.attr('selectedItems').push(option);
                } else {
                    self.attr('selectedItems').splice(_.findIndex(self.attr('selectedItems'), option), 1);
                }
            }
        });
    },

    /**
     * @function url-list.viewModel.deselectAll
     * @description deselect all items
     */
    deselectAll: function() {
        this.attr('selectedItems', []);
        this.attr('items').map(function (option) {
            option.attr('selected', false);
        });
    }
});
