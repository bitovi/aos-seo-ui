require('can/map/define/define');

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
         * @property {Function} filterData
         * @description Property to help update the filter menus with filter data when filtering.
         */
        filterData: {
            set: function () {
                var self = this;

                setTimeout(function () {
                    self.updateFilterMenus();
                });
            }
        },

        /**
         * @property {Object} filterFields
         * @description The filter fields.
         */
        filterFields: {
            get: function () {
                var fields = [];
                var filterConfig = this.attr('filterConfig');

                if (filterConfig) {
                    filterConfig.forEach(function (filter) {
                        var fieldGroups = filter.attr('filterGroups');

                        if (fieldGroups) {
                            fieldGroups.forEach(function (group) {
                                fields.push(group.attr('parameter'));
                            });
                        }
                    });

                    return fields;
                }
            }
        },

        /**
         * @property {Boolean} filtersEnabled
         * @description Determines search filters are enabled.
         * @option Default `true`
         */
        filtersEnabled: {
            type: 'boolean',
            value: true
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
            Value: can.Map
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
         * @property {String} params
         * @description Parameters to use to store Custom Date Range form input.
         */
        params: {
            value: {}
        },

        /**
         * @property {String} dateMask
         * @description Date mask to use on user visible dates.
         * @option {String} Default is MM/DD/YYYY.
         */
        dateMask: {
            value: 'MM/DD/YYYY',
            type: 'string'
        },

        /**
         * @property {String} startDate
         * @description The value of the start date from the date range section.
         * @option {String} Default is empty string.
         */
        startDate: {
            set: function (val) {
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
            get: function () {
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
         * @property {String} endDate
         * @description The value of the end date from the date range section.
         * @option {String} Default is empty string.
         */
        endDate: {
            set: function (val) {
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
            get: function () {
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
         * @property {String} dateError
         * @description Stores data parse error.
         * @option {String} Default is '' (empty string).
         */
        dateError: {
            value: '',
            type: 'string'
        },

        /**
         * @property {boolean} datesOpen
         * @description Maintains state of date visibility.
         * @option {boolean} Default is `false`.
         */
        datesOpen: {
            value: false,
            type: 'boolean'
        },

        /**
         * @function dateInfo
         * @description Processes date ranges into strings.
         * @return {String} Returns the date range as a string.
         */
        dateInfo: {
            get: function () {
                return moment(this.attr('startDate')).format('YYYY-MM-DD[T]HH:mm[Z]') + ' to ' + moment(this.attr('endDate')).format('YYYY-MM-DD[T]HH:mm[Z]');
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
     * @description retrieves the Filter data from the API via the Model
     */
    getFilterData: function () {
        var model = this.attr('model');
        var self = this;

        if (model && model.getFilters) {
            model.getFilters()
                .then(function (filters) {
                    self.attr('filterData', filters);
                })
                .fail(function (error) {
                    self.state.attr('alert', {
                        type: 'error',
                        title: 'Not able to load filters',
                        message: JSON.stringify(error)
                    });
                });
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
    },

    /**
     * @function updateFilterMenus
     * @description Updates the filter menu components, based on the searchFilter property.
     */
    updateFilterMenus: function () {
        var filterMenus = this.attr('filterMenus');
        var searchFilter = this.attr('searchFilter');

        if (filterMenus.length && searchFilter) {
            this.attr('filterConfig').forEach(function (filter, filterIndex) {
                var filterGroups = filter.attr('filterGroups');

                if (filterGroups) {
                    filterGroups.forEach(function (group, groupIndex) {
                        var filterVm;
                        var paramVal = searchFilter[group.attr('parameter')];
                        var selectedGroup;

                        if (paramVal) {
                            filterVm = can.viewModel(filterMenus[filterIndex]);
                            selectedGroup = filterVm.attr('filterGroups')[groupIndex];

                            selectedGroup.attr('filterOptions').forEach(function (option) {
                                if (paramVal.match(option.attr('value'))) {
                                    option.attr('selected', true);
                                }
                            });

                            filterVm.applyFilters();
                        }
                    });
                }
            });
        }
    },

    /**
     * @function updateFilterUrl
     * @description Updates the application state when filters are applied.
     * @param {can.Map} menuVm The current filter menu's view model.
     */
    updateFilterUrl: function (menuVm) {
        var appState = this.attr('state');
        var dateInfo = this.attr('dateInfo').match('Invalid date') ? '' : this.attr('dateInfo');

        if (menuVm && appState) {
            menuVm.attr('filterGroups').forEach(function (group) {
                var filterValues = group.attr('appliedFilterValues').attr().toString();
                var param = group.attr('parameter');

                if (filterValues && param) {
                    appState.attr(param, (filterValues === 'custom-range') && dateInfo ? dateInfo : filterValues);
                } else {
                    appState.removeAttr(param);
                }
            });
        }
    },

    /**
     * @function resetAllFilters
     * @description Resets all filters on the page.
     */
    resetAllFilters: function () {
        var filterMenus = this.attr('filterMenus');
        var filterVm;

        if (filterMenus.length) {
            can.each(filterMenus, function (filterMenu) {
                filterVm = can.viewModel(filterMenu);

                can.each(filterVm.attr('filterGroups'), function (group) {
                    // Unselect all filter options
                    group.attr('isAllSelected', false);
                });

                filterVm.applyFilters();
            });
        }
    }
});
