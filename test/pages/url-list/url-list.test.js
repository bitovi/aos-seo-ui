require('seo-ui/models/url/url.fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var scope;
var state;
var stateObj = {
    page: 'url-list',
    urlPath: ''
};
var testTemplate = require('./url-list.test.stache!');
var urlListPage = require('seo-ui/pages/url-list/url-list');
var urlModel = require('seo-ui/models/url/url');
var ViewModel = require('seo-ui/pages/url-list/url-list.viewmodel');
var vm;

// Renders the component
// Default state can be augmented by passing a parameter with the required changes
var renderPage = function (newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        model: urlModel,
        state: state
    }));

    jasmine.clock().tick(can.fixture.delay);

    component = $('#sandbox seo-url-list');
    scope = component.data('scope');
};

var testSort = function (name) {
    describe(name + ' field', function () {
        beforeEach(function () {
            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');
            jasmine.clock().tick(can.fixture.delay);
        });

        it('by clicking on the ' + name + ' sort button', function () {
            var ascVal = can.viewModel(component.find('pui-grid-list')).attr('items.0');
            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');
            jasmine.clock().tick(can.fixture.delay);

            var descVal = can.viewModel(component.find('pui-grid-list')).attr('items.0');

            expect(ascVal.attr()).not.toEqual(descVal.attr());
        });
    });
};

var updateSearchTerm = function (opts) {
    var txtField = component.find('pui-grid-search input');
    var doSubmit = opts.submit || true;

    txtField.val(opts.value).trigger('input').trigger('change');

    if (doSubmit) {
        component.find('pui-grid-search .btn-search').trigger('click');
    }
};

describe('URL List Page', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig();
        renderPage();
    });

    afterEach(function () {
        jasmineConfigClean();
    });

    describe('view model', function () {
        beforeEach(function () {
            vm = new ViewModel();
        });

        it('has an initial columns value', function () {
            expect(vm.attr('columns').attr()).toEqual([
                {
                    cssClass: 'col-md-2',
                    key: 'partNumber',
                    label: 'Part Number'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'url',
                    label: 'URL'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'createDate',
                    label: 'Created Date',
                    isHidden: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'modifyDate',
                    label: 'Modified Date',
                    isHidden: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'pageTitle',
                    label: 'Page Title'
                },
                {
                    cssClass: 'col-md-3',
                    key: 'description',
                    label: 'Description'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'segment',
                    label: 'Segment'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'region',
                    label: 'Region'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'country',
                    label: 'Country'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'status',
                    label: 'Status'
                }
            ]);
        });

        it('has an initial dataOptions value', function () {
            expect(vm.attr('dataOptions').attr()).toEqual([
                {
                    key: 'url',
                    label: 'URL'
                },
                {
                    key: 'pageTitle',
                    label: 'Page Title'
                },
                {
                    key: 'partNumber',
                    label: 'Part Number',
                    autocomplete: {
                        'character-delay': 2,
                        'key-name': 'partNumber',
                        'model': 'partNumberModel'
                    }
                }
            ]);
        });

        it('has a URL model property', function () {
            expect(vm.attr('urlModel')).toExist();
        });

        it('has an initial pageTitle value', function () {
            expect(vm.attr('pageTitle')).toEqual('URLs');
        });

        it('has a part number model property', function () {
            expect(vm.attr('partNumberModel')).toExist();
        });

        it('has a rowTemplate property', function () {
            expect(vm.attr('rowTemplate')).toExist();
        });

        it('has an initial searchField value', function () {
            expect(vm.attr('searchField')).toEqual('url');
        });
    });

    describe('component', function () {
        it('renders URL list results', function () {
            expect(component.find('pui-grid-list tbody > tr').length).toBeGreaterThan(0);
        });

        describe('searches on the', function () {
            describe('URL field', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'url');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('from the start of a value', function () {
                    updateSearchTerm({
                        value: '/ipad'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(4);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: 'wifi'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: '/ipod-nano/'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });

            describe('Page Title field', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'pageTitle');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('from the start of a value', function () {
                    updateSearchTerm({
                        value: 'iP'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(7);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: '3g'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: 'MacBook Air - Apple'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });

            describe('Part Number field', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'partNumber');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('from the start of a value', function () {
                    updateSearchTerm({
                        value: 'h17'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: 'ZM'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(6);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: 'Z0S9'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });
        });

        describe('sorts by the', function () {
            testSort('country');
            testSort('pageTitle');
            testSort('partNumber');
            testSort('region');
            testSort('segment');
            testSort('url');
            testSort('status');
        });
    });


    describe('Status badge', function () {

        it('Checks if the status badge has correct class name', function () {
            var status = component.find('pui-grid-list tbody > tr > td:last span').text();
            var statusClassName =  status + '-label';
            expect(component.find("pui-grid-list tbody > tr > td:last span").hasClass(statusClassName)).toBe(true);
        });

    });
});
