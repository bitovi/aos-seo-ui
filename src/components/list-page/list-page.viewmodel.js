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
         * @property {Array<Object>} createRequestMarketContextFilterConfig
         * @description Configuration for create request market context filters.
         */
        createRequestMarketContextFilterConfig: {
            value: [
                {
                    filterGroups: [
                        {
                            groupTitle: 'Segment:',
                            parameter: 'segments'
                        }
                    ]
                },
                {
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
                }
            ]
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
         * @property {Boolean} customDateApplied
         * @description Indicates if a custom date range filter has been applied.
         * @option Default `false`
         */
        customDateApplied: {
            type: 'boolean',
            value: false,
            get: function () {
                var appState = this.attr('state');
                var dateInfo = this.attr('dateInfo');

                if (appState && dateInfo) {
                    return dateInfo === appState.attr('dateRanges');
                }
            }
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
         * @property {Number} maxResultLimit
         * @description Maximum value that the result limit must not exceed.
         */
        maxResultLimit: {
            type: 'number',
            value: 200
        },

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
         * @property {Function} primaryHeaderTemplate
         * @description Stores the template renderer function reference.
         */
        primaryHeaderTemplate: {
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
                var searchFields = this.attr('searchFields');
                var searchFilter = this.attr('searchFilter');
                var searchValue = searchQuery.attr('value');
                var state = this.attr('state');

                if (searchFilter) {
                    searchFilter.attr(searchField, searchValue);
                }

                if (state) {
                    state.attr(searchField, searchValue);
                }

                // Clears search value from application state if the search
                // field is not in searchQuery
                if (searchFields && searchFields.length) {
                    searchFields.forEach(function (fieldName) {
                        if (fieldName !== searchField) {
                            state.attr(fieldName, '');
                        }
                    });
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
                this.attr('params').attr('from', moment(val).valueOf());
            },
            get: function () {
                var params = this.attr('params');
                var startDate = params.attr('from') || '';
                var today = this.attr('today');

                return (startDate === '') ? today : moment(startDate).format(this.attr('dateMask'));
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
                this.attr('params').attr('to', moment(val).valueOf());
            },
            get: function () {
                var params = this.attr('params');
                var endDate = params.attr('to') || '';
                var today = this.attr('today');

                return (endDate === '') ? today : moment(endDate).format(this.attr('dateMask'));
            },
            validate: {
                mustValidate: true,
                date: true
            }
        },

        /**
         * @property {String} today
         * @description Today's date.
         */
        today: {
            get: function () {
                var now = new Date();

                return moment(now).format(this.attr('dateMask'));
            }
        },

        /**
         * @property {String} maxDate
         * @description maxDate is today or the endDate whichever is lower.
         */
        maxDate: {
            get: function () {
                var today = this.attr('today');
                var endDate = this.attr('endDate');

                return (endDate && endDate < today) ? endDate : today;
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
         * @property {String} dateInfo
         * @description Processes date ranges into strings.
         */
        dateInfo: {
            get: function () {
                return moment(this.attr('startDate')).format('YYYY-MM-DD[T]HH:mm[Z]') + ' to ' + moment(this.attr('endDate')).format('YYYY-MM-DD[T]HH:mm[Z]');
            }
        },
        /**
         * @property {Boolean} filterSearchApplied
         * @description checks whether filter or search is applied
         */
        filterSearchApplied: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {Boolean} fromDatePickerOpen
         * @description Shows the "From" date picker's open state
         */
        fromDatePickerOpen: {
            type: 'boolean',
            value: false,
            set: function (newVal) {
                if (newVal) {
                    this.attr('toDatePickerOpen', false);
                }

                return newVal;
            }
        },

        /**
         * @property {Boolean} toDatePickerOpen
         * @description Shows the "To" date picker's open state
         */
        toDatePickerOpen: {
            type: 'boolean',
            value: false,
            set: function (newVal) {
                if (newVal) {
                    this.attr('fromDatePickerOpen', false);
                }

                return newVal;
            }
        },
        /** END DATE PROPERTIES */

        /** Grid Column Toggle Properties **/
        /**
         * @property {Boolean} topGridColumnToggleOpen
         * @description Shows the Top GridColumnToggle's open state
         */
        topGridColumnToggleOpen: {
            type: 'boolean',
            value: false,
            set: function (newVal) {
                if (newVal) {
                    this.attr('bottomGridColumnToggleOpen', false);
                }

                return newVal;
            }
        },

        /**
         * @property {Boolean} bottomGridColumnToggleOpen
         * @description Shows the Bottom GridColumnToggle's open state
         */
        bottomGridColumnToggleOpen: {
            type: 'boolean',
            value: false,
            set: function (newVal) {
                if (newVal) {
                    this.attr('topGridColumnToggleOpen', false);
                }

                return newVal;
            }
        }
        /** END Grid Column Toggle Properties **/
    },

    /**
     * @function list-page.viewModel.createRequestToggleAll
     * @description Toggles the selected state of all rows.
     * @param {object} filterGroup data
     * @param {string} groupType parameter
     * @param {boolean} toggleState selected state for checkbox
     */
    createRequestToggleAll: function (filterGroup, groupType, toggleState) {
        var matchedGroup;
        filterGroup.forEach(function (group) {
            if (group.attr('parameter') === groupType) {
                group.attr('selected', toggleState);
                matchedGroup = group;
            }
        });

        matchedGroup.filterOptions.map(function (option) {
            option.attr('selected', toggleState);
        });
    },

    /**
     * @function list-page.viewModel.createRequestToggle
     * @description Toggles select All/Deselect All if all checkboxs selects and selects secondary filter groups options.
     * @param {object} filterGroup data
     * @param {string} groupType parameter
     * @param {boolean} optionIndex option index.
     * @param {event} evt click event of checkbox
     */
    createRequestToggle: function (filterGroup, groupType, optionIndex, evt) {
        setTimeout(function () {
            var selectedOption;

            filterGroup.forEach(function (group) {
                if (group.attr('parameter') === groupType) {
                    selectedOption = group.attr('filterOptions')[optionIndex]
                    group.attr('selected', group.attr('filterOptions').length === _.filter(group.attr('filterOptions'), { selected: true }).length);
                }
            });

            var selectedState = evt.currentTarget.checked;
            var secondaryValues = selectedOption.attr('secondaryValues');
            var secondaryParameter = selectedOption.attr('secondaryParameter');
            var secondaryFilterGroup = _.find(filterGroup, function (group) {
                return group.attr('parameter') === secondaryParameter;
            });

            // Select Secondary Values based on the Secondary Parameter
            if (secondaryParameter) {
                secondaryValues.forEach(function (value) {
                    var filterOption = _.find(secondaryFilterGroup.attr('filterOptions'), function (option) {
                        return option.attr('value').toLowerCase() === value.toLowerCase();
                    });

                    filterOption.attr('selected', selectedState);
                });
            }

        }, 0);
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

                if (match) {
                    group.attr('filterOptions', match.attr('options'));
                }
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
     * @function resetAllFilters
     * @description Resets all filters on the page.
     */
    resetAllFilters: function () {
        var filterMenus = this.attr('filterMenus');
        var filterVm;
        var today = this.attr('today');

        if (filterMenus.length) {
            can.each(filterMenus, function (filterMenu) {
                filterVm = can.viewModel(filterMenu);

                can.each(filterVm.attr('filterGroups'), function (group) {
                    // Deselects all filter options
                    group.toggleAllFilters(false);
                });

                if (filterVm.applyFilters) {
                    filterVm.applyFilters();
                }
            });

            // Resets Date Range filter-menu custom range dates to default (today)
            // End date must be set first, so we don't accidentally attempt to set
            // the start date to a date later than the end date.
            this.attr('endDate', today);
            this.attr('startDate', today);

            this.attr('datesOpen', false);
        }
    },

    /**
     * @function toggleModal
     * @description Enabled the overlay model when we click on create button.
     *
     */
    toggleModal: function () {
        this.attr('isActive', !this.attr('isActive'));
    },


    /**
     * @function updateFilterMenus
     * @description Updates the filter menu components, based on the searchFilter property.
     */
    updateFilterMenus: function () {
        var filterConfig = this.attr('filterConfig');
        var filterMenus = this.attr('filterMenus');
        var searchFilter = this.attr('searchFilter');
        var self = this;

        if (filterConfig && filterMenus.length && searchFilter) {
            filterConfig.forEach(function (filter, filterIndex) {
                var filterGroups = filter.attr('filterGroups');

                if (filterGroups) {
                    filterGroups.forEach(function (group, groupIndex) {
                        var filterVm = can.viewModel(filterMenus[filterIndex]);
                        var menuGroups = filterVm.attr('filterGroups');
                        var paramVal = searchFilter[group.attr('parameter')];
                        var paramDates = [];
                        var selectedGroup;

                        if (filterVm && menuGroups && paramVal) {
                            selectedGroup = menuGroups[groupIndex];

                            // Ensures the date values from the URL are persisted after a page refresh
                            if (group.attr('parameter') === 'dateRanges' && paramVal.split(' to ').length > 1) {
                                paramDates = paramVal.split(' to ');

                                self.attr({
                                    startDate: paramDates[0],
                                    endDate: paramDates[1]
                                });
                            }

                            selectedGroup.attr('filterOptions').forEach(function (option) {
                                var optionVal = option.attr('value');

                                if (paramVal.match(_.escapeRegExp(optionVal)) || (optionVal === 'custom-range' && paramVal === self.attr('dateInfo'))) {
                                    option.attr('selected', true);
                                }
                            });

                            if (filterVm.applyFilters) {
                                filterVm.applyFilters();
                            }
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
        var dateInfo = this.attr('dateInfo');
        var validDate = dateInfo.match('Invalid date') ? '' : dateInfo;

        if (menuVm && appState) {
            menuVm.attr('filterGroups').forEach(function (group) {
                var filterValues = group.attr('appliedFilterValues').attr().toString();
                var param = group.attr('parameter');

                // Sets custom date parameter value to date string
                if (filterValues === 'custom-range' && validDate) {
                    filterValues = validDate;
                }

                if (filterValues && param) {
                    // Adds filter name and value to appState and URL
                    appState.attr(param, filterValues);
                } else {
                    appState.removeAttr(param);
                }
            });
        }
    }
});
