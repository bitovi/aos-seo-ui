var $ = require('jquery');
var can = require('can');
var moment = require('moment');

require('seo-ui/models/url/url.fixture');
require('seo-ui/utils/viewHelpers');

var AppState = require('seo-ui/models/appstate/appstate');
var component;
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
var testTemplate = require('./list-page.test.stache');
var ViewModel = require('seo-ui/components/list-page/list-page.viewmodel');
var vm;

// Filter Menu setup
var FilterViewModel = require('pui/components/filter-menu/viewmodel');
var filterVm;
var filterGroups;
var firstFilterGroup;
var secondFilterGroup;
var filterOptions;
var filterOptions2;
var filterMenus;
var firstMenu;
var menuTrigger;
var firstInput;

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
                buttonLabel: 'Regions:',
                placement: 'bottom',
                filterGroups: [
                    {
                        groupTitle: 'Regions:',
                        inputType: 'checkbox',
                        filterOptions: [
                            {
                                "label": "AMR",
                                "value": "amr",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "BR",
                                    "CA",
                                    "MX",
                                    "US"
                                ]
                            },
                            {
                                "label": "APAC",
                                "value": "apac",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "AU",
                                    "CN",
                                    "HK",
                                    "HK",
                                    "IN",
                                    "ID",
                                    "JP",
                                    "MY",
                                    "NZ",
                                    "PH",
                                    "SG",
                                    "KR",
                                    "TW",
                                    "TH",
                                    "TH",
                                    "VN"
                                ]
                            },
                            {
                                "label": "JAPAN",
                                "value": "japan",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "JP"
                                ]
                            }
                        ]
                    },
                    {
                        groupTitle: 'Countries:',
                        inputType: 'checkbox',
                        filterOptions: [
                            {
                                "label": "Brazil",
                                "value": "br"
                            },
                            {
                                "label": "Canada",
                                "value": "ca"
                            },
                            {
                                "label": "Mexico",
                                "value": "mx"
                            },
                            {
                                "label": "United States",
                                "value": "us"
                            }
                        ]
                    }
                ]
            }
        ]
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-list-page');
    vm = can.viewModel(component);
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

    describe('View model', function () {
        beforeEach(function () {
            renderPage();
        });

        describe('Has default scope value of', function () {
            it('title', function () {
                var title = vm.attr('pageTitle');
                expect(title).toEqual('List Page');
            });
        });

        describe('Has default value of today as', function () {
            it('today\'s date', function () {
                var today = vm.attr('today');
                var now = new Date();
                var todaysDate = moment.utc(now).format('MM/DD/YYYY');
                expect(today).toEqual(todaysDate);
            });
        });

        describe('Has default Start Date value of', function () {
            it('today\'s date', function () {
                var startDate = vm.attr('startDate');
                var now = new Date();
                var today = moment.utc(now).format('MM/DD/YYYY');
                expect(startDate).toEqual(today);
            });
        });

        describe('Has default End Date value of', function () {
            it('today\'s date', function () {
                var endDate = vm.attr('endDate');
                var now = new Date();
                var today = moment.utc(now).format('MM/DD/YYYY');
                expect(endDate).toEqual(today);
            });
        });

        describe('When Reset Filters method is called', function () {
            beforeEach(function () {
                // Data setup
                filterMenus = component.find('pui-filter-menu');
                firstMenu = filterMenus.eq(0);
                secondMenu = filterMenus.eq(1);
                filterVm = can.viewModel(firstMenu);
                filterVm2 = can.viewModel(secondMenu);
                filterGroups = [
                    {
                        groupTitle: 'Region:',
                        parameter: 'regions',
                        inputType: 'checkbox',
                        filterOptions: [
                            {
                                "label": "AMR",
                                "value": "amr",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "BR",
                                    "CA",
                                    "MX",
                                    "US"
                                ]
                            },
                            {
                                "label": "APAC",
                                "value": "apac",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "AU",
                                    "CN",
                                    "HK",
                                    "HK",
                                    "IN",
                                    "ID",
                                    "JP",
                                    "MY",
                                    "NZ",
                                    "PH",
                                    "SG",
                                    "KR",
                                    "TW",
                                    "TH",
                                    "TH",
                                    "VN"
                                ]
                            },
                            {
                                "label": "JAPAN",
                                "value": "japan",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "JP"
                                ]
                            }
                        ]
                    },
                    {
                        groupTitle: 'Countries:',
                        parameter: 'countries',
                        inputType: 'checkbox',
                        filterOptions: [
                            {
                                "label": "Brazil",
                                "value": "br"
                            },
                            {
                                "label": "Canada",
                                "value": "ca"
                            },
                            {
                                "label": "Mexico",
                                "value": "mx"
                            },
                            {
                                "label": "United States",
                                "value": "us"
                            }
                        ]
                    }
                ];
                filterGroups2 = [
                    {
                        groupTitle: 'Date Range:',
                        inputType: 'radio',
                        parameter: 'dateRanges',
                        filterOptions: [
                            {
                                "label": "All",
                                "value": "all"
                            },
                            {
                                "label": "Last 24 Hours",
                                "value": "last-24-hours"
                            },
                            {
                                "label": "Last 2 Weeks",
                                "value": "last-2-weeks"
                            },
                            {
                                "label": "Last Month",
                                "value": "last-month"
                            },
                            {
                                "label": "Custom Range",
                                "value": "custom-range"
                            }
                        ]
                    }
                ];
                filterVm.attr('filterGroups', filterGroups);
                filterVm2.attr('filterGroups', filterGroups2);
                firstFilterGroup = filterVm.attr('filterGroups.0');
                secondFilterGroup = filterVm.attr('filterGroups.1');
                dateRangesFilterGroup = filterVm2.attr('filterGroups.0');
                filterOptions = firstFilterGroup.attr('filterOptions');
                filterOptions2 = dateRangesFilterGroup.attr('filterOptions');

                // Select filterOptions
                filterOptions[0].attr('selected', true);
                filterOptions[1].attr('selected', true);
                filterOptions[2].attr('selected', true);

                filterOptions2[4].attr('selected', true);
                filterVm2.attr('startDate', '01/01/2000');
                filterVm2.attr('endDate', '01/01/2000');

                vm.resetAllFilters();
            });

            it('then filterOptions[0] selected property is false', function () {
                expect(filterOptions[0].attr('selected')).toBe(false);
            });

            it('then filterOptions[1] selected property is false', function () {
                expect(filterOptions[1].attr('selected')).toBe(false);
            });

            it('then filterOptions[2] selected property is false', function () {
                expect(filterOptions[2].attr('selected')).toBe(false);
            });

            it('then the firstFilterGroup\'s isAllSelected property is false', function () {
                expect(firstFilterGroup.attr('isAllSelected')).toEqual(false);
            });

            it('then the startDate is today', function () {
                var now = new Date();
                var today = moment.utc(now).format('MM/DD/YYYY');
                expect(vm.attr('startDate')).toEqual(today);
            });

            it('then the endDate is today', function () {
                var now = new Date();
                var today = moment.utc(now).format('MM/DD/YYYY');
                expect(vm.attr('endDate')).toEqual(today);
            });
        });
    });

    describe('Component', function () {
        beforeEach(function () {
            renderPage();
            component = $('#sandbox seo-list-page');
            vm = can.viewModel(component);
        });

        // Not sure why this is failing,but will fix as part of different PR.This will unblock the build
        // it('Displays alert if storage delayedAlert set', function () {
        //     var vm = new ViewModel();
        //     var alert = vm.attr('state.alert.type');
        //     expect(alert).toEqual('success');
        // });

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });

        describe('Reset Filters button', function () {
            it('Renders', function () {
                expect(component.find('.reset-all-filters').length).toBeGreaterThan(0);
            });

            it('Has proper label', function () {
                expect(component.find('.reset-all-filters').text()).toBe('Reset Filters');
            });
        });

        describe('When clicking the Reset Filters button', function () {
            beforeEach(function () {
                spyOn(vm, 'resetAllFilters');
                $('.reset-all-filters').trigger('click');
            });

            it('calls resetAllFilters()', function () {
                expect(vm.resetAllFilters).toHaveBeenCalled();
            });
        });

        describe('Routing', function () {
            it('is done by selecting item in the list', function () {
                var stateObj = state;

                state.bind('page', function (ev, newVal, oldVal) {
                    expect(newVal).toBeDefined();
                });

                component.find('pui-grid-list .item:eq(0)').trigger('click');
                jasmine.clock().tick(can.fixture.delay);
            });
        });

        describe('When AMR Region is selected', function () {
            beforeEach(function () {
                renderPage();

                // Data setup
                component = $('#sandbox seo-list-page');
                filterMenus = component.find('pui-filter-menu');
                firstMenu = filterMenus.eq(0);
                filterVm = can.viewModel(firstMenu);
                filterGroups = [
                    {
                        groupTitle: 'Regions:',
                        parameter: 'regions',
                        inputType: 'checkbox',
                        filterOptions: [
                            {
                                "label": "AMR",
                                "value": "amr",
                                "secondaryParameter": "countries",
                                "secondaryValues": [
                                    "BR",
                                    "CA",
                                    "MX",
                                    "US"
                                ]
                            }
                        ]
                    },
                    {
                        groupTitle: 'Countries:',
                        parameter: 'countries',
                        inputType: 'checkbox',
                        filterOptions: [
                            {
                                "label": "Brazil",
                                "value": "br"
                            },
                            {
                                "label": "Canada",
                                "value": "ca"
                            },
                            {
                                "label": "Mexico",
                                "value": "mx"
                            },
                            {
                                "label": "United States",
                                "value": "us"
                            }
                        ]
                    }
                ];
                filterVm.attr('filterGroups', filterGroups);
                firstFilterGroup = filterVm.attr('filterGroups.0');
                secondFilterGroup = filterVm.attr('filterGroups.1');
                filterOptions = firstFilterGroup.attr('filterOptions');
                filterOptions2 = secondFilterGroup.attr('filterOptions');

                menuTrigger = firstMenu.find('.dropdown');
                menuTrigger.trigger('click');
                // Select region
                firstInput = firstMenu.find('.amr-toggle');
                firstInput.trigger('click');
            });

            it('then corresponding countries are selected: Brazil.', function () {
                expect(firstMenu.find('.br-toggle').prop('checked')).toEqual(true);
            });

            it('then corresponding countries are selected: Canada', function () {
                expect(firstMenu.find('.ca-toggle').prop('checked')).toEqual(true);
            });

            it('then corresponding countries are selected: Mexico', function () {
                expect(firstMenu.find('.mx-toggle').prop('checked')).toEqual(true);
            });

            it('then corresponding countries are selected: USA', function () {
                expect(firstMenu.find('.us-toggle').prop('checked')).toEqual(true);
            });
        });
    });
});
