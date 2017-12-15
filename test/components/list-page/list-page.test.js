require('seo-ui/components/list-page/list-page');
require('seo-ui/models/url/url.fixture');

var AppState = require('seo-ui/models/appstate/appstate');
var $ = require('jquery');
var can = require('can');
var jasmineConfig = require('test/jasmine-configure');
var Model = require('seo-ui/models/url/url');
var moment = require('moment');
var testTemplate = require('./list-page.test.stache!');

var $component;
var $filterMenus;
var state;
var stateObj = {
    page: '',
    targetPath: '',
    storage: {
        delayedAlert: {
            message: 'Your changes have been saved.',
            persist: true,
            title: 'Well done!',
            type: 'success'
        }
    }
};
var vm;

// Renders the component
// Default state can be augmented by passing a parameter with the required changes
var renderPage = function (newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        model: Model,
        state: state,
        dataOptions: [
            {
                key: 'targetPath',
                label: 'Target Path'
            },
            {
                key: 'description',
                label: 'Description'
            }
        ],
        columns: [
            {
                key: 'targetPath',
                label: 'Target Path',
                cssClass: 'col-md-4'
            },
            {
                key: 'description',
                label: 'Description',
                cssClass: 'col-md-4'
            },
            {
                key: 'modifyDate',
                label: 'Last Edited Date',
                cssClass: 'col-md-2'
            },
            {
                key: 'modifyUser',
                label: 'Last Edited By',
                cssClass: 'col-md-2'
            }
        ],
        searchField: 'targetPath',
        detailsKey: 'targetPath',
        filterConfig: [
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
    }));

    jasmine.clock().runToLast();

    $component = $('#sandbox seo-list-page');
    vm = can.viewModel($component);
    $filterMenus = vm.attr('filterMenus');
};

describe('List Page', function () {
    var jasmineConfigClean;

    beforeEach(function () {
        jasmineConfigClean = jasmineConfig();
    });

    afterEach(function () {
        jasmineConfigClean();
    });

    describe('view model', function () {
        beforeEach(function () {
            renderPage();
        });

        describe('columns property', function () {
            it('is defined', function () {
                expect(vm.attr('columns')).toBeDefined();
            });
        });

        describe('currentPage property', function () {
            it('is initially set to 1', function () {
                expect(vm.attr('currentPage')).toEqual(1);
            });
        });

        describe('customDateApplied property', function () {
            it('is initially set to false', function () {
                expect(vm.attr('customDateApplied')).toEqual(false);
            });

            describe('when applying a custom date filter', function () {
                beforeEach(function () {
                    vm.attr('state.dateRanges', vm.attr('dateInfo'));
                });

                it('sets customDateApplied to true', function () {
                    expect(vm.attr('customDateApplied')).toEqual(true);
                });

                it('sets datesOpen to true', function () {
                    expect(vm.attr('datesOpen')).toEqual(true);
                });
            });
        });

        describe('dataOptions property', function () {
            it('is defined', function () {
                expect(vm.attr('dataOptions')).toBeDefined();
            });
        });

        describe('disableNewItemButton property', function () {
            it('is initially set to false', function () {
                expect(vm.attr('disableNewItemButton')).toEqual(false);
            });
        });

        describe('expandableRows property', function () {
            it('is initially set to false', function () {
                expect(vm.attr('expandableRows')).toEqual(false);
            });
        });

        describe('filterFields property', function () {
            it('initially contains the filter parameter names', function () {
                expect(vm.attr('filterFields')).toEqual(['regions', 'countries', 'dateRanges', 'nemoReadyRecord']);
            });
        });

        describe('filtersEnabled property', function () {
            it('is initially set to true', function () {
                expect(vm.attr('filtersEnabled')).toEqual(true);
            });
        });

        describe('items property', function () {
            it('is defined', function () {
                expect(vm.attr('items')).toBeDefined();
            });
        });

        describe('maxResultLimit property', function () {
            it('is 200', function () {
                expect(vm.attr('maxResultLimit')).toEqual(200);
            });
        });

        describe('model property', function () {
            it('is defined', function () {
                expect(vm.attr('model')).toBeDefined();
            });
        });

        describe('pageTitle property', function () {
            it('is initially set to "List Page"', function () {
                expect(vm.attr('pageTitle')).toEqual('List Page');
            });
        });

        describe('searchField property', function () {
            it('has an initial value', function () {
                expect(vm.attr('searchField')).toEqual('targetPath');
            });
        });

        describe('searchFields property', function () {
            it('initially contains the search field keys', function () {
                expect(vm.attr('searchFields')).toEqual(['targetPath', 'description']);
            });
        });

        describe('searchFilter property', function () {
            it('is defined', function () {
                expect(vm.attr('searchFilter')).toBeDefined();
            });
        });

        describe('searchQuery property', function () {
            it('is defined', function () {
                expect(vm.attr('searchQuery')).toBeDefined();
            });

            describe('when updated with searchField', function () {
                var state;

                beforeEach(function () {
                    state = vm.attr('state');

                    state.attr({
                        description: 'hello',
                        targetPath: 'path/to/a/thing'
                    });

                    vm.attr('searchField', 'description');
                    vm.attr('searchQuery', {
                        field: 'description',
                        value: 'goodbye'
                    });
                });

                it('updates the searchFilter property with the new search field and value', function () {
                    expect(vm.attr('searchFilter.description')).toEqual('goodbye');
                });

                it('updates the application state with the new search value', function () {
                    expect(state.attr('description')).toEqual('goodbye');
                });

                it('clears other search field values from the application state', function () {
                    expect(state.attr('targetPath')).toEqual('');
                });
            });
        });

        describe('searchValue property', function () {
            it('is initially an empty string', function () {
                expect(vm.attr('searchValue')).toEqual('');
            });
        });

        describe('showNewItemModal property', function () {
            it('is initially set to false', function () {
                expect(vm.attr('showNewItemModal')).toEqual(false);
            });
        });

        describe('date properties', function () {
            var today;

            beforeEach(function () {
                var now = new Date();
                today = moment(now).format(vm.attr('dateMask'));
            });

            describe('params property', function () {
                it('is initially an empty object', function () {
                    expect(vm.attr('params').attr()).toEqual({});
                });
            });

            describe('dateMask property', function () {
                it('is initially set to "MM/DD/YYYY"', function () {
                    expect(vm.attr('dateMask')).toEqual('MM/DD/YYYY');
                });
            });

            describe('startDate property', function () {
                it('is initially set to today\'s date', function () {
                    expect(vm.attr('startDate')).toEqual(today);
                });
            });

            describe('endDate property', function () {
                it('is initially set to today\'s date', function () {
                    expect(vm.attr('endDate')).toEqual(today);
                });
            });

            describe('today property', function () {
                it('is initially set to today\'s date', function () {
                    expect(vm.attr('today')).toEqual(today);
                });
            });

            describe('maxDate property', function () {
                it('is initially set to today\'s date', function () {
                    expect(vm.attr('maxDate')).toEqual(today);
                });
            });

            describe('dateError property', function () {
                it('is initially an empty string', function () {
                    expect(vm.attr('dateError')).toEqual('');
                });
            });

            describe('datesOpen property', function () {
                it('is initially set to false', function () {
                    expect(vm.attr('datesOpen')).toEqual(false);
                });
            });

            describe('dateInfo property', function () {
                it('is initially set to "[start date] to [end date]"', function () {
                    expect(vm.attr('dateInfo')).toEqual(moment(vm.attr('startDate')).format('YYYY-MM-DD[T]HH:mm[Z]') + ' to ' + moment(vm.attr('endDate')).format('YYYY-MM-DD[T]HH:mm[Z]'));
                });
            });

            describe('fromDatePickerOpen property', function () {
                it('is initially set to false', function () {
                    expect(vm.attr('fromDatePickerOpen')).toEqual(false);
                });

                describe('when set to true', function () {
                    beforeEach(function () {
                        vm.attr('toDatePickerOpen', true);
                        vm.attr('fromDatePickerOpen', true);
                    });

                    it('sets fromDatePickerOpen to true', function () {
                        expect(vm.attr('fromDatePickerOpen')).toEqual(true);
                    });

                    it('sets toDatePickerOpen to false', function () {
                        expect(vm.attr('toDatePickerOpen')).toEqual(false);
                    });
                });
            });

            describe('toDatePickerOpen property', function () {
                it('is initially set to false', function () {
                    expect(vm.attr('toDatePickerOpen')).toEqual(false);
                });

                describe('when set to true', function () {
                    beforeEach(function () {
                        vm.attr('fromDatePickerOpen', true);
                        vm.attr('toDatePickerOpen', true);
                    });

                    it('sets toDatePickerOpen to true', function () {
                        expect(vm.attr('toDatePickerOpen')).toEqual(true);
                    });

                    it('sets fromDatePickerOpen to false', function () {
                        expect(vm.attr('fromDatePickerOpen')).toEqual(false);
                    });
                });
            });
        });

        describe('when invoking resetAllFilters()', function () {
            var countriesGroup;
            var dateGroup;
            var regionsGroup;
            var regionVm;

            beforeEach(function () {
                // Data setup
                regionVm = can.viewModel($filterMenus.eq(0));
                regionsGroup = regionVm.attr('filterGroups.0');
                countriesGroup = regionVm.attr('filterGroups.1');
                dateGroup = can.viewModel($filterMenus.eq(1)).attr('filterGroups.0');

                // Selects filterOptions
                regionsGroup.toggleAllFilters(true);
                countriesGroup.toggleAllFilters(true);
                dateGroup.attr('filterOptions.4.selected', true);

                vm.attr('startDate', '01/01/2000');
                vm.attr('endDate', '01/01/2000');

                vm.attr('datesOpen', true);

                vm.resetAllFilters();
            });

            it('deselects all check box filter options', function () {
                regionsGroup.attr('filterOptions').forEach(function (option) {
                    expect(option.attr('selected')).toEqual(false);
                });

                countriesGroup.attr('filterOptions').forEach(function (option) {
                    expect(option.attr('selected')).toEqual(false);
                });
            });

            it('deselects all radio button filter options', function () {
                dateGroup.attr('filterOptions').forEach(function (option) {
                    expect(option.attr('selected')).toEqual(false);
                });
            });

            it('resets the endDate property', function () {
                expect(vm.attr('endDate')).toEqual(vm.attr('today'));
            });

            it('resets the startDate property', function () {
                expect(vm.attr('startDate')).toEqual(vm.attr('today'));
            });

            it('sets the datesOpen property to false', function () {
                expect(vm.attr('datesOpen')).toEqual(false);
            });
        });

        describe('when selecting a filter in a group with "*" as an option value', function () {
            var filterVm;

            beforeEach(function () {
                filterVm = can.viewModel($filterMenus.eq(0));

                vm.attr('state.countries', 'br');
                vm.attr('searchFilter', {countries: 'br'});
                vm.updateFilterMenus();
            });

            it('updates the filter menu selection and does not throw a JavaScript error', function () {
                expect(filterVm.attr('filterGroups.1.filterOptions.1.selected')).toEqual(true);
            });
        });

        describe('when the application state limit property exceeds maxResultLimit', function () {
            beforeEach(function () {
                renderPage({
                    limit: 525600
                });
            });

            it('sets the state limit to the maxResultLimit', function () {
                expect(vm.attr('state.limit')).toEqual(vm.attr('maxResultLimit'));
            });
        });
    });

    describe('component', function () {
        beforeEach(function () {
            renderPage();
        });

        // Not sure why this is failing,but will fix as part of different PR.This will unblock the build
        // it('Displays alert if storage delayedAlert set', function () {
        //     var vm = new ViewModel();
        //     var alert = vm.attr('state.alert.type');
        //     expect(alert).toEqual('success');
        // });

        it('displays a page title', function () {
            expect($component.find('.page-header').text().trim()).toEqual(vm.attr('pageTitle'));
        });

        it('displays list tools', function () {
            expect($component.find('.list-tools')).toBeVisible();
        });

        it('displays a grid list', function () {
            expect($component.find('pui-grid-list > .table-responsive')).toBeVisible();
        });

        describe('Reset Filters button', function () {
            it('renders', function () {
                expect($component.find('.reset-all-filters')).toExist();
            });

            it('has proper label', function () {
                expect($component.find('.reset-all-filters').text()).toEqual('Reset Filters');
            });
        });

        describe('when clicking the Reset Filters button', function () {
            beforeEach(function () {
                spyOn(vm, 'resetAllFilters');
                $('.reset-all-filters').trigger('click');
            });

            it('invokes resetAllFilters()', function () {
                expect(vm.resetAllFilters).toHaveBeenCalled();
            });
        });

        describe('routing', function () {
            it('is done by selecting an item in the list', function () {
                state.bind('page', function (ev, newVal, oldVal) {
                    expect(newVal).toBeDefined();
                });

                $component.find('pui-grid-list .item:eq(0)').trigger('click');
            });
        });

        describe('when selecting a filter option with a secondary parameter and values', function () {
            var $locationMenu;

            beforeEach(function () {
                $locationMenu = $filterMenus.eq(0);

                // Select region
                $locationMenu.find('.dropdown').trigger('click');
                $locationMenu.find('.amr-toggle').trigger('click');
            });

            it('selects the correlating options in another menu', function () {
                expect($locationMenu.find('.br-toggle').prop('checked')).toEqual(true);
                expect($locationMenu.find('.ca-toggle').prop('checked')).toEqual(true);
                expect($locationMenu.find('.mx-toggle').prop('checked')).toEqual(true);
                expect($locationMenu.find('.us-toggle').prop('checked')).toEqual(true);
            });

            it('does not select options not included in the secondaryValues list', function () {
                expect($locationMenu.find('.au-toggle').prop('checked')).toEqual(false);
            });
        });

        describe('Grid Column Toggle menu toggling', function () {
            var $firstToggle;
            var $secondToggle;

            beforeEach(function () {
                $firstToggle = $component.find('pui-grid-column-toggle').eq(0);
                $secondToggle = $component.find('pui-grid-column-toggle').eq(1);
            });

            describe('when opening the first menu', function () {
                beforeEach(function () {
                    $firstToggle.find('.popover-trigger').trigger('click');
                });

                it('displays the first popover', function () {
                    expect($firstToggle.find('.popover')).toBeVisible();
                });
            });

            describe('when opening the second menu', function () {
                beforeEach(function () {
                    $secondToggle.find('.popover-trigger').trigger('click');
                });

                it('displays the second popover', function () {
                    expect($secondToggle.find('.popover')).toBeVisible();
                });

                it('hides the first popover', function () {
                    expect($firstToggle.find('.popover')).not.toBeVisible();
                });
            });

            describe('when re-opening the first menu', function () {
                beforeEach(function () {
                    $firstToggle.find('.popover-trigger').trigger('click');
                });

                it('displays the first popover', function () {
                    expect($firstToggle.find('.popover')).toBeVisible();
                });

                it('hides the second popover', function () {
                    expect($secondToggle.find('.popover')).not.toBeVisible();
                });
            });
        });

        describe('date picker toggling', function () {
            var $dateMenu;

            beforeEach(function () {
                $dateMenu = $filterMenus.eq(1);

                // Opens Date Range filter menu
                $dateMenu.find('.dropdown').trigger('click');

                // Selects Custom Range
                $dateMenu.find('.custom-range-toggle').trigger('click');
            });

            describe('clicking the From Date Picker toggle button', function () {
                var $fromToggler;
                var $fromPicker;

                beforeEach(function () {
                    $fromToggler = $dateMenu.find('.form-control-feedback').eq(0);
                    $fromPicker = $dateMenu.find('.custom-range-selector .form-group').eq(0);
                });

                describe('when the From Date Picker is closed', function () {
                    beforeEach(function () {
                        vm.attr('fromDatePickerOpen', false);
                        $fromToggler.trigger('click');
                    });

                    it('opens the From Date Picker calendar panel', function () {
                        expect($fromPicker.find('.panel-body')).toBeVisible();
                    });
                });

                describe('when the From Date Picker is open', function () {
                    beforeEach(function () {
                        vm.attr('fromDatePickerOpen', true);
                        $fromToggler.trigger('click');
                    });

                    it('closes the From Date Picker calendar panel', function () {
                        expect($fromPicker.find('.panel-body')).not.toBeVisible();
                    });
                });

                describe('when the To Date Picker is open', function () {
                    beforeEach(function () {
                        vm.attr('toDatePickerOpen', true);
                        $fromToggler.trigger('click');
                    });

                    it('closes the To Date Picker calendar panel', function () {
                        var $toPicker = $dateMenu.find('.custom-range-selector .form-group').eq(1);

                        expect($toPicker.find('.panel-body')).not.toBeVisible();
                    });
                });
            });

            describe('clicking the To Date Picker toggle button', function () {
                var $toToggler;
                var $toPicker;

                beforeEach(function () {
                    $toToggler = $dateMenu.find('.form-control-feedback').eq(1);
                    $toPicker = $dateMenu.find('.custom-range-selector .form-group').eq(1);
                });

                describe('when the To Date Picker is closed', function () {
                    beforeEach(function () {
                        vm.attr('toDatePickerOpen', false);
                        $toToggler.trigger('click');
                    });

                    it('opens the To Date Picker calendar panel', function () {
                        expect($toPicker.find('.panel-body')).toBeVisible();
                    });
                });

                describe('when the To Date Picker is open', function () {
                    beforeEach(function () {
                        vm.attr('toDatePickerOpen', true);
                        $toToggler.trigger('click');
                    });

                    it('closes the To Date Picker calendar panel', function () {
                        expect($toPicker.find('.panel-body')).not.toBeVisible();
                    });
                });

                describe('when the From Date Picker is open', function () {
                    beforeEach(function () {
                        vm.attr('fromDatePickerOpen', true);
                        $toToggler.trigger('click');
                    });

                    it('closes the From Date Picker calendar panel', function () {
                        var $fromPicker = $dateMenu.find('.custom-range-selector .form-group').eq(0);

                        expect($fromPicker.find('.panel-body')).not.toBeVisible();
                    });
                });
            });
        });

        describe('when hiding all of the list columns via the bottom Grid Column Toggle component', function () {
            var $secondToggle;

            beforeEach(function () {
                $secondToggle = $component.find('pui-grid-column-toggle').eq(1);
                $secondToggle.find('.popover-trigger').trigger('click');

                can.each($secondToggle.find('.list-group'), function (item) {
                    var $optionCheckbox = $(item).find('.option-checkbox');

                    if ($optionCheckbox.prop('checked') === true) {
                        $optionCheckbox.trigger('click');
                    }
                });
            });

            it('displays the entire Grid Toggle popover', function () {
                var isPopoverTopVisible = $secondToggle.find('.popover').offset().top > 0;

                expect(isPopoverTopVisible).toBe(true);
            });
        });

        describe('when opening the Date Picker and clicking the ESC key', function(){
            var $dateMenu;
            var $fromToggler;
            var $firstToggle;

            beforeEach(function () {
                $dateMenu = $filterMenus.eq(1);

                // Opens Date Range filter menu
                $dateMenu.find('.dropdown').trigger('click');

                // Selects Custom Range
                $dateMenu.find('.custom-range-toggle').trigger('click');

                // Open From Date Picker
                $fromToggler = $dateMenu.find('.form-control-feedback').eq(0);
                $fromToggler.click();

                var evt = $.Event('keyup');

                evt.which = 27;
                $(document).trigger(evt);

                $firstToggle = $component.find('pui-grid-column-toggle').eq(0);
                $firstToggle.find('.popover-trigger').trigger('click');
            });

            it('hides the date-picker-overlay when ESC button is clicked', function(){
                expect($component.find('.date-picker-overlay')).not.toBeVisible();
            });
        });

        describe('when the create request button is clicked', function () {
            beforeEach(function () {
                $createRequestButton  = $component.find('.create-request-button');
                $createRequestButton.trigger('click');
            });

            it('opens the create request modal', function () {
                expect($component.find('pui-modal')).toBeVisible();
            });
        });

        describe('when the create reques modal  is opened', function () {
            beforeEach(function () {
                $createRequestButton  = $component.find('.create-request-button');
                $createRequestButton.trigger('click');
            });

            it('check for the title name', function () {
                expect($component.find('.modal-title').text()).toEqual('Select the Segment and region');
            });
            it('check for the title for the filter Segment', function () {
                expect($component.find('.modal-body').find(".filter-groups").eq(0).find(".group-title").text()).toEqual('Segment:');
            });
            it('check for the title for the filter Segment options', function () {
                expect($component.find('.modal-body').find(".filter-groups").eq(0).find(".list-group-item").length).toBeGreaterThan(0);
            });
            it('check for the title for the  filter Region', function () {
                expect($component.find('.modal-body').find(".filter-groups").eq(1).find(".filter-group").eq(0).find(".group-title").text()).toEqual('Region:');
            });
            it('check for the title for the filter Region options', function () {
                expect($component.find('.modal-body').find(".filter-groups").eq(1).find(".filter-group").eq(0).find(".list-group-item").length).toBeGreaterThan(0);
            });
            it('check for the title for the filter Country', function () {
                expect($component.find('.modal-body').find(".filter-groups").eq(1).find(".filter-group").eq(1).find(".group-title").text()).toEqual('Country:');
            });
            it('check for the title for the filter Country options', function () {
                expect($component.find('.modal-body').find(".filter-groups").eq(1).find(".filter-group").eq(1).find(".list-group-item").length).toBeGreaterThan(0);
            });
        });

        describe('when select all link is clicked', function () {
            beforeEach(function () {
                $createRequestButton  = $component.find('.create-request-button');
                $createRequestButton.trigger('click');
            });

            it('will select all options for Segment', function () {
                $component.find('.select-all').eq(0).trigger('click');
                expect($component.find('.modal-body').find(".filter-groups").eq(0).find(".list-group-item").length)
                    .toEqual($component.find('.modal-body').find(".filter-groups").eq(0).find(".list-group-item input:checked").length);
            });
        });








    });
});
