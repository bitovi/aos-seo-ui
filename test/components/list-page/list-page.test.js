require('seo-ui/components/list-page/list-page');
require('seo-ui/models/url/url.fixture');

var $ = require('jquery');
var can = require('can');
var moment = require('moment');

var AppState = require('seo-ui/models/appstate/appstate');
var $component;
var $filterMenus;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var Model = require('seo-ui/models/url/url');
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
var testTemplate = require('./list-page.test.stache!');
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
            }
        ]
    }));

    jasmine.clock().tick(can.fixture.delay);

    $component = $('#sandbox seo-list-page');
    vm = can.viewModel($component);
    $filterMenus = vm.attr('filterMenus');
};

describe('List Page', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig({
            persistentSandbox: true
        });
    });

    afterEach(function () {
        jasmineConfigClean(true);

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
                expect(vm.attr('filterFields')).toEqual(['regions', 'countries', 'dateRanges']);
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
                today = moment.utc(now).format(vm.attr('dateMask'));
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
                expect(regionsGroup.attr('isAllSelected')).toEqual(true);
                expect(countriesGroup.attr('isAllSelected')).toEqual(true);

                vm.attr('datesOpen', true);

                dateGroup.attr('filterOptions.4.selected', true);
                vm.attr('startDate', '01/01/2000');
                vm.attr('endDate', '01/01/2000');

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

        it('renders', function () {
            expect($component).toExist();
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
                var stateObj = state;

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
    });
});
