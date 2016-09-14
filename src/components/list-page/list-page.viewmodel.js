require('bootstrap/js/collapse');
require('can/map/define/define');
require('can/view/stache/stache');

var _ = require('lodash');
var can = require('can');
var moment = require('moment');

var templateRenderer = function (newTemplate) {
    return function () {
        return newTemplate;
    };
};

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array<Object>} columns
         * @description The list of columns (key name, header label, column width) used by the Grid List.
         */
        columns: {
            Type: can.List
        },

        /**
         * @property {Number} currentPage
         * @description The current page number.
         */
        currentPage: {
            type: 'number',
            value: 1
        },

        /**
         * @property {Array<Object>} dataOptions
         * @description A list of search-able keys/columns, used by the Grid Search component.
         */
        dataOptions: {
            Type: can.List
        },

        /**
         * @property {Boolean} disableNewItemButton
         * @description Determines if the new item create button (+) should be shown.
         */
        disableNewItemButton: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {Boolean} expandableRows
         * @description Determines if the Grid List rows should be expandable.
         */
        expandableRows: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {Function} expandedTemplate
         * @description Template to be used for an expanded row.
         */
        expandedTemplate: {
            type: templateRenderer
        },

        /**
         * @property {Object} filterFields
         * @description The filter fields.
         */
        filterFields: {
            get: function () {
                var filterConfig = this.attr('filterConfig');
                var result = [];

                if (filterConfig) {
                    can.each(filterConfig.attr(), function(filter) {
                        can.each(filter.filterGroups, function(filterGroupItem) {
                            result.push(filterGroupItem.parameter);
                        });
                    });

                    return result;
                }
            }
        },

        /**
         * @property {Array<Object>} items
         * @description Array of item objects to display in the Grid List.
         */
        items: {},

        /**
         * @property {can.Model} model
         * @description The model to be used on the list page.
         */
        model: {
            type: '*'
        },

        /**
         * @property {String} pageTitle
         * @description The title/header of the list page.
         */
        pageTitle: {
            type: 'string',
            value: 'List Page'
        },

        /**
         * @property {Function} rowTemplate
         * @description Stores the template renderer function reference.
         */
        rowTemplate: {
            type: templateRenderer
        },

        /**
         * @property {String} searchField
         * @description The initial search key.
         */
        searchField: {
            type: 'string'
        },

        /**
         * @property {Object} searchFields
         * @description The search-able fields.
         */
        searchFields: {
            get: function () {
                var dataOptions = this.attr('dataOptions');

                // Grid Search fields
                if (dataOptions) {
                    return dataOptions.attr().map(function (dataOption) {
                        return dataOption.key;
                    });
                }
            }
        },

        /**
         * @property {Object} searchFilter
         * @description The current Advanced Search fields and terms.
         */
        searchFilter: {
            Value: can.Map,
            set: function (searchFilter) {
                // Update AppState/route
                var filterFields = this.attr('filterFields');
                var state = this.attr('state');

                if (state && state.attr) {
                    filterFields.forEach(function (searchField) {
                        state.removeAttr(searchField);
                    });

                    state.attr(searchFilter.attr());
                }

                return searchFilter;
            }
        },

        /**
         * @property {Object} searchQuery
         * @description The current Basic Search field and term.
         */
        searchQuery: {
            Value: can.Map,
            set: function (searchQuery) {
                // Update AppState/route
                var searchField = this.attr('searchField');
                var searchFilter = this.attr('searchFilter');
                var state = this.attr('state');

                searchFilter.attr(searchField, searchQuery.attr('value'));

                if (state) {
                    state.attr(searchField, searchQuery.attr('value'));
                }

                return searchQuery;
            }
        },

        /**
         * @property {Boolean} searchStateEnabled
         * @description Determines if the Basic Search is enabled.
         */
        searchStateEnabled: {
            type: 'boolean',
            value: true
        },

        /**
         * @property {String} searchValue
         * @description The current Basic Search term.
         */
        searchValue: {
            type: 'string',
            value: ''
        },

        /**
         * @property {Boolean} showNewItemModal
         * @description Determines if the New Item Modal is displayed.
         */
        showNewItemModal: {
            type: 'boolean',
            value: false
        },

        /** DATE PROPERTIES */
        /**
         * @property {String} api.components.filter-menu.viewmodel.params params
         * @description Parmateres to use to store Custom Date Range form input.
         */
        params: {
            value: {}
        },

        /**
         * @property {String} api.components.filter-menu.viewmodel.dateMask dateMask
         * @description Date mask to use on user visible dates.
         * @option {String} Default is MM/DD/YYYY.
         */
        dateMask: {
            value: 'MM/DD/YYYY',
            type: 'string'
        },

        /**
         * @property {String} api.components.filter-menu.viewmodel.startDate startDate
         * @description The value of the start date from the date range section.
         * @option {String} Default is empty string.
         */
        startDate: {
            set: function(val) {
                var start = moment(val);
                var end = moment(this.attr('endDate'));

                if (!start.isValid()) {
                    this.attr('dateError', 'Please enter a valid start date.');
                    return val;
                }

                if (end.isValid() && !start.isSame(end) && !start.isBefore(end)) {
                    this.attr('dateError', 'The end date needs to occur after the start date.');
                    return val;
                }

                this.attr('dateError', '');
                this.attr('params').attr('from', moment.utc(val).valueOf());
            },
            get: function() {
                var params = this.attr('params');
                var startDate = params.attr('from') ? params.attr('from') : '';

                return (startDate === '') ? startDate : moment.utc(startDate).format(this.attr('dateMask'));
            },
            validate: {
                mustValidate: true,
                date: true
            }
        },

        /**
         * @property {String} api.components.filter-menu.viewmodel.endDate endDate
         * @description The value of the end date from the date range section.
         * @option {String} Default is empty string.
         */
        endDate: {
            set: function(val) {
                var end = moment(val);
                var start = moment(this.attr('startDate'));

                if (!end.isValid()) {
                    this.attr('dateError', 'Please enter a valid end date.');
                    return val;
                }
                if (start.isValid() && !start.isSame(end) && !start.isBefore(end)) {
                    this.attr('dateError', 'The end date needs to occur after the start date.');
                    return val;
                }
                this.attr('dateError', '');
                this.attr('params').attr('to', moment.utc(val).valueOf());
            },
            get: function() {
                var params = this.attr('params');
                var endDate = params.attr('to') ? params.attr('to') : '';

                return (endDate === '') ? endDate : moment.utc(endDate).format(this.attr('dateMask'));
            },
            validate: {
                mustValidate: true,
                date: true
            }
        },

        /**
         * @property {String} api.components.filter-menu.viewmodel.dateError dateError
         * @description Stores data parse error.
         * @option {String} Default is '' (empty string).
         */
        dateError: {
            value: '',
            type: 'string'
        },

        /**
         * @property {boolean} api.components.filter-menu.viewmodel.datesOpen datesOpen
         * @description Maintains state of date visibility.
         * @option {boolean} Default is `false`.
         */
        datesOpen: {
            value: false,
            type: 'boolean'
        },

        /**
         * @function api.components.filter-menu.viewmodel.dateInfo dateInfo
         * @description Processes date ranges into strings.
         * @return {String} Returns the date range as a string.
         */
        dateInfo: {
            get: function() {
                return moment(this.attr('startDate')).format('YYYY-MM-DD[T]HH:mm:ss[Z]') + ' to ' + moment(this.attr('endDate')).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
            }
        }
        /** END DATE PROPERTIES */
    },

    /**
     * @function enableNewItemModal
     * @description Shows the new item modal
     */
    enableNewItemModal: function () {
        this.attr('showNewItemModal', true);
    },

    /**
     * @function getFilterData
     * @description retrieves the Filter data from the API via the FilterModel
     */
    getFilterData: function () {
        var filterModel = this.attr('filterModel');
        var self = this;

        if (filterModel && filterModel.getFilters) {
            this.attr('filterModel').getFilters()
                .then(function (filters) {
                    self.attr('filterData', filters);
                });
        }
    },

    enableBasicSearch: function () {
        if (!this.attr('searchStateEnabled')) {
            this.attr('searchStateEnabled', true);
        }
    },

    /**
     * @property getFilterOptions
     * @description gets the filter options matching the paramName
     */
    getFilterOptions: function (filterGroups) {
        var filterData = this.attr('filterData');
        var match;

        if (filterData && filterGroups) {
            filterGroups.forEach(function (group) {
                match = _.find(filterData.filters, {
                    'parameter': group.attr('parameter')
                });

                group.attr('filterOptions', match.attr('options'));
            });

            return filterGroups;
        }
    },

    /**
     * @function navigateToDetails
     * @description Navigates to an asset's detail page
     * @param {can.Map} itemData The data of the item to navigate to
     */
    navigateToDetails: function (itemData) {
        var appState = this.attr('state');
        var key = this.attr('detailsKey');
        var routeData = {};
        var type = this.attr('type');

        if (itemData && appState && key) {
            routeData.page = type + '-details';
            routeData.route = appState.attr('route') + '/:' + key;
            routeData[key] = itemData.attr(key);

            // Updates the app state and changes the route
            appState.setRouteAttrs(routeData);
        }
    }

});
