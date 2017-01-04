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

require('bootstrap/js/collapse');
require('pui/components/action-bar-menu/action-bar-menu');
require('pui/components/date-picker/date-picker');
require('pui/components/filter-menu/filter-menu');
require('pui/components/grid-column-toggle/grid-column-toggle');
require('pui/components/grid-list/grid-list');
require('pui/components/grid-search/grid-search');
require('pui/components/pagination/pagination');

var $ = require('jquery');
var _ = require('lodash');
var can = require('can');

var template = require('./list-page.stache!');
var ViewModel = require('./list-page.viewmodel');

module.exports = can.Component.extend({
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
            var maxResultLimit = vm.attr('maxResultLimit');
            var searchFields = vm.attr('searchFields');
            var searchQuery = vm.attr('searchQuery');

            if (appState && appState.attr) {
                // Set up search query from state
                can.each(appState.attr(), function (val, key) {
                    if (filterFields && val && filterFields.indexOf(key) > -1) {
                        // Advanced search
                        filterOptions.attr(key, val);
                        vm.attr('searchFilter', filterOptions.attr());
                    } else if (searchFields && val && searchFields.indexOf(key) > -1) {
                        // Basic search
                        searchQuery.attr({
                            field: key,
                            value: val
                        });

                        vm.attr('searchField', key);
                        vm.attr('searchValue', val);
                    }
                });

                // Prevents the user from setting the export limit too high
                // via the URL/application state
                if (appState.attr('limit') > maxResultLimit) {
                    appState.attr('limit', maxResultLimit);
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

            vm.attr('filterMenus', this.element.find('pui-filter-menu'));
        },

        '{state} countries': 'searchDidChange',

        /**
         * @description Handles change of dateRanges application state property.
         */
        '{state} dateRanges': function () {
            var vm = this.viewModel;

            this.searchDidChange();

            // Ensures the custom date range input remains open if a custom range is applied
            vm.attr('datesOpen', vm.attr('customDateApplied'));
        },

        '{state} description': 'searchDidChange',
        '{state} pageTitle': 'searchDidChange',
        '{state} pageTypes': 'searchDidChange',
        '{state} partNumber': 'searchDidChange',
        '{state} regions': 'searchDidChange',
        '{state} segments': 'searchDidChange',
        '{state} statuses': 'searchDidChange',
        '{state} url': 'searchDidChange',

        searchDidChange: _.debounce(function () {
            var vm = this.viewModel;
            var appState = vm.attr('state');
            var filterFields = vm.attr('filterFields');
            var key;
            var searchQuery = vm.attr('searchQuery');
            var searchQueryValue;
            var stateValue;
            var updatedSearch = {};

            // Advanced search
            filterFields.forEach(function (field) {
                stateValue = appState.attr(field);

                if (stateValue) {
                    updatedSearch[field] = stateValue;
                }
            });

            // If there was no new search criteria selected ..
            if ($.isEmptyObject(updatedSearch)) {
                // ... then reset the filters
                vm.resetAllFilters();
            }

            vm.attr('searchFilter', updatedSearch);

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

                    vm.attr('searchValue', stateValue);
                }
            }

            if ((!$.isEmptyObject(searchQuery.attr()) && searchQuery.attr('value') !== '') || !$.isEmptyObject(vm.attr('searchFilter').attr())) {
                vm.attr('filterSearchApplied', true);
            } else {
                vm.attr('filterSearchApplied', false);
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
         * @description Handles change event of the Date Range filter group menu.
         * @param {jQuery object} $el The changed element.
         * @param {jQuery event} evnt The change event.
         */
        '.date-range-group change': function ($el, evnt) {
            var customRangeSelected = $(evnt.target).is('.custom-range-toggle');

            // Shows date picker if the custom-range option is selected
            this.viewModel.attr('datesOpen', customRangeSelected);
        },

        /**
         * @description Handles click event of the Date Range filter group Clear button.
         */
        '.date-range-group .clear-radio click': function () {
            this.viewModel.attr('datesOpen', false);
        },

        /**
         * @description Event listener to select corresponding countries when Region is selected
         * @param {jQuery object} $el the clicked element
         */
        'pui-filter-menu .filter-group input click': function ($input) {
            var filterVm = can.viewModel($input.closest('pui-filter-menu'));
            var filterGroups = filterVm.attr('filterGroups');
            var $thisGroup = $input.closest('.filter-group');
            var $listGroups = $input.closest('.filter-groups').find('.filter-group');
            var groupIndex = $listGroups.index($thisGroup);
            var $listItems = $thisGroup.find('.list-group-item');
            var optionIndex = $listItems.index($input.closest('.list-group-item'));
            var selectedOption = filterGroups[groupIndex].attr('filterOptions')[optionIndex];
            var selectedState = $input.prop('checked');
            var secondaryValues = selectedOption.attr('secondaryValues');
            var secondaryParameter = selectedOption.attr('secondaryParameter');
            var secondaryFilterGroup = _.find(filterGroups, function (group) {
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
        },

        /**
         * @description Handles mouseup event of the Date Range Apply Filter button.
         * @param {jQuery object} $applyBtn The button receiving the mouseup event.
         */
        '.custom-range-selector ~ .apply-filters mouseup': function ($applyBtn) {
            var filterVm = can.viewModel($applyBtn.closest('pui-filter-menu'));
            var vm = this.viewModel;

            // Compares the dateInfo attribute to the dateRanges app state value.
            // If they differ, we call vm.updateFilterUrl() so the date change
            // will trigger filtering.

            // This workaround is necessary because vm.updateFilterUrl() is
            // normally triggered by a change to the filter-trigger label, but
            // the Date Range label doesn't change when selecting a custom range.
            if (!vm.attr('customDateApplied')) {
                vm.updateFilterUrl(filterVm);
            }
        },

        /**
         * @description Handles mouseup event of the Date Range Cancel Filter button.
         */
        '.custom-range-selector ~ .cancel-filters mouseup': function () {
            var vm = this.viewModel;

            // Ensures the custom date range input remains open if a custom range is applied
            vm.attr('datesOpen', vm.attr('customDateApplied'));
        },

        /**
         * @description Close datepicker overlay when ESC key is hit
         */
        '{window} keyup': function ($el, evt) {
            // Close popover when the ESC key is hit
            if (evt.which === 27) {
                $('.date-picker-overlay').off().remove();
                var $datepickers = $('pui-date-picker');

                can.each($datepickers, function (picker) {
                    var pickerVm = can.viewModel(picker);

                    if (pickerVm.attr('pickerOpen') === true) {
                        pickerVm.attr('pickerOpen', false);
                    }
                });
            }
        }
    }
});
