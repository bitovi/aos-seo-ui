require('bootstrap/js/collapse');
require('can/map/define/define');
require('can/view/stache/stache');

var _ = require('lodash');
var can = require('can');

var CheckboxList = require('pui/components/filter-menu/checkbox-list.js');

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
                if (filterConfig) {
                    return filterConfig.attr().map(function (filter) {
                        return filter.parameter;
                    });
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
         * @property {Boolean} multiSearchActive
         * @description Determines if an Advanced Search is being applied.
         */
        multiSearchActive: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {Boolean} multiSearchEnabled
         * @description Determines if the Advanced Search is open.
         */
        multiSearchEnabled: {
            type: 'boolean',
            value: false
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
        }
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

    /**
     * @property getFilterOptions
     * @description gets the filter options matching the paramName
     */
    getFilterOptions: function (paramName) {
        var filterData = this.attr('filterData');
        var match;

        if (filterData && paramName) {
            match = _.find(filterData.filters, function (filter) {
                if (filter.parameter === paramName) {
                    return filter;
                }
            });

            // The function should always return an array
            return new CheckboxList(match ? match.options.attr() : []);
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
