/**
 * @module {can.Component} api.components.list-page List Page
 * @parent api.components
 * @group api.components.list-page.components 0 Components
 * @author Jan Jorgensen
 *
 * @param {String} page-title The Title of the page
 * @param {can.Model} model The model the page will use to populate the list
 * @param {template} row-template The template pui-grid-list will use to render rows
 * @param {{}} data-options The options for the data keys and values
 * @param {[]} columns The columns to be rendered
 * @param {String} search-field The default search field
 * @param {boolean} disable-advanced-search Utility to disable advanced search
 *
 *
 * @description  This component is used to create list pages.
 * @demo ../../demos/schema/demo.html
 *
 * @body
 *
 * # Use
 *
 * ```
 * <seo-list-page
 *     columns="{columns}"
 *     data-options="{dataOptions}"
 *     disable-advanced-search="true"
 *     model="{model}"
 *     page-title="{pageTitle}"
 *     row-template="{rowTemplate}"
 *     search-field="{searchField}"
 * ></seo-list-page>
 * ```
 */

require('pui/components/action-bar-menu/action-bar-menu');
require('pui/components/filter-menu/filter-menu');
require('pui/components/grid-column-toggle/grid-column-toggle');
require('pui/components/grid-list/grid-list');
require('pui/components/grid-multi-search/grid-multi-search');
require('pui/components/grid-search/grid-search');
require('pui/components/pagination/pagination');

var $ = require('jquery');
var _ = require('lodash');
var can = require('can');

var template = require('./list-page.stache!');
var ViewModel = require('./list-page.viewmodel');

module.exports = can.Component.extend(
    {
        tag: 'seo-list-page',
        template: template,
        viewModel: ViewModel,
        helpers: {
            /**
            * @description Converts a string (which can also be a hyphenated string)
            * into a chosen cased string (like proper case). It only converts to proper
            * case for now but it can be updated to do lower, upper (although you should
            * use CSS styles/Bootstrap classes for that), etc.
            */
            casing: function (mode, val, dehyphenate, opts) {
                var casedValue = val();
                var str;

                if (casedValue) {
                    str = casedValue.trim();

                    // check if de-hyphenate was passed
                    if (!opts) {
                        opts = dehyphenate;
                        dehyphenate = true;
                    }

                    // Convert hyphens to spaces
                    str = dehyphenate ? str.replace(/-+?/g, ' ') : str;

                    // If proper casing was chosen
                    if (mode === 'proper') {
                        // Get every word in the string
                        str = str.replace(/\w+/g, function (match) {
                            // Upper case just the first character
                            return match.charAt(0).toUpperCase() + match.slice(1);
                        });
                    }

                    return str;
                }
            }
        },
        events: {
            /**
             * @description Invoked when the component is initialized.
             */
            'init': function () {
                var vm = this.viewModel;
                var appState = vm.attr('state');
                var filterFields = vm.attr('filterFields');
                var filterOptions = new can.Map();
                var key;
                var searchFields = vm.attr('searchFields');
                var searchQuery = vm.attr('searchQuery');

                if (appState && appState.attr) {
                    // Set up search query from state
                    appState = appState.attr();

                    // Advanced Search
                    for (key in appState) {
                        if (appState.hasOwnProperty(key) && appState[key] && filterFields.indexOf(key) > -1) {
                            filterOptions.attr(key, appState[key]);
                        }
                    }

                    vm.attr('searchFilter', filterOptions.attr());

                    // Simple search
                    for (key in appState) {
                        if (appState.hasOwnProperty(key) && appState[key] && searchFields.indexOf(key) > -1) {
                            searchQuery.attr({
                                field: key,
                                value: appState[key]
                            });

                            vm.attr('searchField', key);
                            vm.attr('searchValue', appState[key]);

                            break;
                        }
                    }
                }
            },

            /**
             * @description Invoked when component is inserted.
             * Mostly just handles delayed alerts that exist in app state storage
             */
            'inserted': function () {
                var vm = this.viewModel;
                var storage = vm.attr('state.storage');

                // Attempting to render an alert right before a transition causes
                // the alert to not render. This is a workaround for those situations.
                if (storage && storage.attr('delayedAlert')) {
                    // Apply the alert object to the alert property on state
                    vm.attr('state.alert', storage.attr('delayedAlert'));

                    // Remove the property so it doesn't get triggered again later
                    vm.removeAttr('state.storage.delayedAlert');
                }

                vm.getFilterData();
            },

            '{state} dateRanges': 'searchDidChange',
            '{state} description': 'searchDidChange',
            '{state} pageTitle': 'searchDidChange',
            '{state} partNumber': 'searchDidChange',
            '{state} regions': 'searchDidChange',
            '{state} segments': 'searchDidChange',
            '{state} statuses': 'searchDidChange',
            '{state} url': 'searchDidChange',

            searchDidChange: _.debounce(function () {
                var vm = this.viewModel;
                var appState = vm.attr('state');
                var filterFields = vm.attr('filterFields');
                var i;
                var key;
                var searchFilter = vm.attr('searchFilter');
                var searchFilterValue;
                var searchQuery = vm.attr('searchQuery');
                var searchQueryValue;
                var stateValue;
                var updatedSearch;

                // Advanced search
                for (i = 0; i < filterFields.length; i += 1) {
                    key = filterFields[i];
                    searchFilterValue = searchFilter.attr(key) || '';
                    stateValue = appState.attr(key) || '';

                    if (searchFilterValue !== stateValue) {
                        if (!updatedSearch) {
                            updatedSearch = {};
                        }

                        updatedSearch[key] = stateValue;
                    }
                }

                if (updatedSearch) {
                    vm.attr('searchFilter', updatedSearch);
                }

                // Simple search
                key = searchQuery.attr('field');

                if (key) {
                    searchQueryValue = searchQuery.attr('value') || '';
                    stateValue = appState.attr(key) || '';

                    if (searchQueryValue !== stateValue) {
                        vm.attr('searchQuery', {
                            field: key,
                            value: stateValue
                        });
                    }
                }
            }),

            /**
             * @description Handles click event of an item in the Grid List.
             * @param {jQuery object} $row The table row receiving the click event
             * @param {jQuery event} evnt The click event
             */
            'pui-grid-list .item click': function ($row, evnt) {
                var expandBtnClicked = $(evnt.target).is('.expand-toggle');
                var itemData = $row.data('item');

                if (itemData && !expandBtnClicked) {
                    this.viewModel.navigateToDetails(itemData);
                }
            },

            /**
             * @description Event listener executes Filtering
             * @param {jQuery object} $el the clicked element
             */
            'pui-filter-menu .btn-default click': function ($el) {
                var vm = this.viewModel;
                var filterVm = can.viewModel($el.closest('pui-filter-menu'));
                var newFilter = {};
                var searchFilter = vm.attr('searchFilter');
                var searchParam = (filterVm.attr('parameter') !== 'dateRanges') ? filterVm.attr('parameter') : 'Date Ranges';

                newFilter[searchParam] = filterVm.attr('selectedFilters').toString() || 'all';

                vm.attr('searchFilter', can.extend(searchFilter.attr(), newFilter));

                // Close Filter Menu
                filterVm.attr('isMenuOpen', false);
            },

            /**
             * @description Event listener that opens the Filter-menu popover
             * @param {jQuery object} $el the clicked element
             */
            'pui-filter-menu .dropdown click': function ($el) {
                var $filterMenus = $('pui-filter-menu');
                var clickedFilterVm = can.viewModel($el.closest('pui-filter-menu'));

                can.each($filterMenus, function (filterMenu) {
                    var filterVm = can.viewModel(filterMenu);

                    if (filterVm !== clickedFilterVm) {
                        filterVm.attr('isMenuOpen', false);
                    }
                });
            }
        }
    }
);
