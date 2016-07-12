/**
 * @module {can.Component} api.components.list-page List Page
 * @parent api.components
 * @group api.copmonents.detail-page.components 0 Components
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
 * <seo-list-page page-title="{pageTitle}" model="{model}" row-template="{rowTemplate}" data-options="{dataOptions}" columns="{columns}" search-field="{searchField}" disable-advanced-search="true"></seo-list-page>
 * ```
 */

var $ = require('jquery');
var _ = require('lodash');
var can = require('can');

var template = require('./list-page.stache');
var ViewModel = require('./list-page.viewmodel.js');

require('pui/components/action-bar-menu/action-bar-menu');

module.exports = can.Component.extend(
    {
        tag: 'seo-list-page',
        template: template,
        viewModel: ViewModel,
        helpers: {
            // TODO Move helper to global helper
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
                var count = 0;
                var key;
                var multiSearchEnabled;
                var vm = this.viewModel;
                var searchFields = vm.attr('searchFields');
                var searchFilter = new can.Map();
                var searchQuery = vm.attr('searchQuery');
                var stateObject = vm.attr('state').attr();

                // Determine whether the user is performing an advanced search
                for (key in stateObject) {
                    if (stateObject.hasOwnProperty(key) && stateObject[key] && searchFields.indexOf(key) > -1) {
                        count += 1;
                    }
                }

                multiSearchEnabled = count > 1;
                vm.attr('multiSearchActive', multiSearchEnabled);
                vm.attr('multiSearchEnabled', multiSearchEnabled);
                vm.attr('searchStateEnabled', !multiSearchEnabled);

                // Set up search query from state
                if (multiSearchEnabled) {
                    // Advanced search
                    for (key in stateObject) {
                        if (stateObject.hasOwnProperty(key) && stateObject[key] && searchFields.indexOf(key) > -1) {
                            searchFilter.attr(key, stateObject[key]);
                        }
                    }

                    vm.attr('searchFilter', searchFilter.attr());
                } else {
                    // Simple search
                    for (key in stateObject) {
                        if (stateObject.hasOwnProperty(key) && stateObject[key] && searchFields.indexOf(key) > -1) {
                            searchQuery.attr({
                                field: key,
                                value: stateObject[key]
                            });

                            vm.attr('searchField', key);
                            vm.attr('searchValue', stateObject[key]);

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

                if (vm.attr('multiSearchEnabled')) {
                    $('#multi-search', this.element).collapse('show');
                }
            },

            '{state} pageTitle': 'searchDidChange',
            '{state} partNumber': 'searchDidChange',
            '{state} url': 'searchDidChange',

            searchDidChange: _.debounce(function () {
                var i;
                var key;
                var vm = this.viewModel;
                var searchFields = vm.attr('searchFields');
                var searchFilter = vm.attr('searchFilter');
                var searchFilterValue;
                var searchQuery = vm.attr('searchQuery');
                var searchQueryValue;
                var state = vm.attr('state');
                var stateValue;
                var updatedSearch;

                if (vm.attr('multiSearchEnabled')) {
                    // Advanced search
                    for (i = 0; i < searchFields.length; i += 1) {
                        key = searchFields[i];
                        searchFilterValue = searchFilter.attr(key) || '';
                        stateValue = state.attr(key) || '';

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
                } else {
                    // Simple search
                    key = searchQuery.attr('field');

                    if (key) {
                        searchQueryValue = searchQuery.attr('value') || '';
                        stateValue = state.attr(key) || '';

                        if (searchQueryValue !== stateValue) {
                            vm.attr('searchQuery', {
                                field: key,
                                value: stateValue
                            });
                        }
                    }
                }
            }),

            /**
             * @description Invoked when leaving the page.
             */
            'removed': function () {
                this.scope.clearContextDetails();
            },

            /**
             * @description Handles click event of an item in the Grid List.
             * @param {jQuery object} $row The table row receiving the click event
             * @param {jQuery event} evnt The click event
             */
            'pui-grid-list .item click': function ($row, evnt) {
                var expandBtnClicked = $(evnt.target).is('.expand-toggle');
                var itemData = $row.data('item');

                if (itemData && !expandBtnClicked) {
                    this.scope.navigateToDetails(itemData);
                }
            }
        }
    }
);
