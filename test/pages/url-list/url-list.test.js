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


require('seo-ui/models/url/url.fixture');

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
    describe(name, function () {
        beforeEach(function () {
            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');
            jasmine.clock().tick(can.fixture.delay);
        });

        it('By clicking on sort button for ' + name, function () {
            var ascVal  = can.viewModel(component.find('pui-grid-list')).attr('items.0');
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

    describe('View model', function () {
        beforeEach(function () {
            vm = new ViewModel();
        });

        it('Has default values', function () {
            expect(vm.attr('columns').attr()).toEqual([
                {
                    cssClass: 'col-md-2',
                    key: 'partNumber',
                    label: 'Part Number'
                },
                {
                    cssClass: 'col-md-4',
                    key: 'url',
                    label: 'URL'
                },
                {
                    cssClass: 'col-md-3',
                    key: 'pageTitle',
                    label: 'Page Title'
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
                }
            ]);

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
                    label: 'Part Number'
                }
            ]);

            expect(vm.attr('model')).toExist();
            expect(vm.attr('rowTemplate')).toExist();
            expect(vm.attr('searchField')).toEqual('url');
            expect(vm.attr('title')).toEqual('URLs');
        });
    });

    describe('Component', function () {
        it('Renders URL list results', function () {
            expect(component.find('pui-grid-list tbody > tr').length).toBeGreaterThan(0);
        });

        describe('Search is performed for fields', function () {
            describe('URL', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'url');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('Start of URL', function () {
                    updateSearchTerm({
                        value: '/ipad'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(4);
                });

                it('Within URL', function () {
                    updateSearchTerm({
                        value: 'wifi'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('Full URL', function () {
                    updateSearchTerm({
                        value: '/ipod-nano/'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });

            describe('Page Title', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'pageTitle');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('Start of title', function () {
                    updateSearchTerm({
                        value: 'iP'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(6);
                });

                it('Within title', function () {
                    updateSearchTerm({
                        value: '3g'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('Full title', function () {
                    updateSearchTerm({
                        value: 'MacBook Air - Apple'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });

            describe('Part Number', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'partNumber');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('Start of part number', function () {
                    updateSearchTerm({
                        value: 'ipod'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('Within part number', function () {
                    updateSearchTerm({
                        value: '1050'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('Full part number', function () {
                    updateSearchTerm({
                        value: 'IPAD2_WIFI'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });
        });

        describe('Sorting is performed for fields', function () {
            testSort('country');
            testSort('pageTitle');
            testSort('partNumber');
            testSort('region');
            testSort('segment');
            testSort('url');
        });
    });
});
