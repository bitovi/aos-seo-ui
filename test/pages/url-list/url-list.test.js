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
                    cssClass: 'col-md-1',
                    key: 'partNumber',
                    label: 'Part #'
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
                    cssClass: 'col-md-4',
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
                    cssClass: 'col-md-1',
                    key: 'pageType',
                    label: 'Page Type'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'status',
                    label: 'Status'
                }
            ]);
        });

        it('has an initial count value', function () {
            expect(vm.attr('count')).toEqual(0);
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
                    key: 'description',
                    label: 'Description'
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

        it('has an initial filterConfig value', function () {
            expect(vm.attr('filterConfig').attr()).toEqual([
                {
                    btnLabel: 'All Segments',
                    filterGroups: [
                        {
                            groupTitle: 'Segment:',
                            parameter: 'segments'
                        }
                    ]
                },
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
                    btnLabel: 'All Page Types',
                    filterGroups: [
                        {
                            groupTitle: 'Page Type:',
                            parameter: 'pageTypes'
                        }
                    ]
                },
                {
                    btnLabel: 'All Statuses',
                    filterGroups: [
                        {
                            groupTitle: 'Status:',
                            inputType: 'radio',
                            parameter: 'statuses'
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
            ]);
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

        it('has a URL model property', function () {
            expect(vm.attr('urlModel')).toExist();
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

            describe('Description field', function () {
                beforeEach(function () {
                    var searchValue = component.find('pui-grid-search .search-text').val();

                    scope.attr('searchField', 'description');

                    // Resets search results
                    if (searchValue) {
                        component.find('pui-grid-search .input-reset').trigger('click');
                    }
                });

                it('from the start of a value', function () {
                    updateSearchTerm({
                        value: 'Bacon'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: 'IT department-level'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: 'ipsum dolor'
                    });

                    jasmine.clock().tick(can.fixture.delay);

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
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

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(9);
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
            testSort('description');
            testSort('pageTitle');
            testSort('partNumber');
            testSort('region');
            testSort('segment');
            testSort('status');
            testSort('url');
        });
    });

    describe('status badge', function () {
        var $badge;

        beforeEach(function () {
            $badge = component.find('pui-grid-list .item').eq(0).find('.status > .grid-item-value > span');
        });

        it('displays properly', function () {
            expect($badge.text().trim()).toEqual('modified');
        });

        it('has a correlating class name', function () {
            expect($badge.hasClass($badge.text().trim() + '-label')).toEqual(true);
        });
    });

    describe('page title and title anatomy', function () {
        var $results;

        beforeEach(function () {
            $results = component.find('pui-grid-list .item');
        });

        describe('when a result has a titleAnatomy property', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(4).find('.grid-item-value');
            });

            it('displays the page title in segments', function () {
                expect($resultTitle.find('.page-title-value').length).toEqual(5);
                expect($resultTitle.find('.page-title-value').eq(3).text().trim()).toEqual('iPad Air 2 Wi-Fi 128GB - Gold  - Apple  (CA)');
            });

            it('displays a key path for each title segment', function () {
                expect($resultTitle.find('.title-anatomy-key-path > li').length).toEqual(5);
                expect($resultTitle.find('.title-anatomy-key-path > li').eq(3).text().trim()).toEqual('store.seo.full.pagetitle');
            });

            describe('when the title anatomy type is text_asset', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('.title-anatomy-key-path > li').eq(2);
                });

                it('creates a link to the asset', function () {
                    expect($keyPath.find('a')).toBeVisible();
                    expect($keyPath.find('a').attr('href')).toEqual('https://storedev-pubsys.corp.apple.com/nemo/text-assets/store.base_title?version=integration');
                });

                it('displays a key icon next to the key path', function () {
                    expect($keyPath.find('.icon-key')).toBeVisible();
                });
            });

            describe('when the title anatomy type is product_attribute', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('.title-anatomy-key-path > li').eq(4);
                });

                it('displays an attribute icon next to the key path', function () {
                    expect($keyPath.find('.indicator-product-attribute')).toBeVisible();
                    expect($keyPath.find('.indicator-product-attribute').text().trim()).toEqual('a');
                });

                it('does not create a link', function () {
                    expect($keyPath.find('a')).not.toExist();
                });
            });

            describe('when a key path does not have a link property', function () {
                var $keyPaths;

                beforeEach(function () {
                    $keyPaths = $results.eq(0).find('.title-anatomy-key-path > li');
                });

                it('does not create an HTML link', function () {
                    $keyPaths.each(function () {
                        expect($(this).find('a').length).toEqual(0);
                    });
                });

                it('displays a key icon next to the key path', function () {
                    $keyPaths.each(function () {
                        expect($(this).find('.icon-key').length).toEqual(1);
                    });
                });
            });
        });

        describe('when a result does not have a titleAnatomy property', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(7).find('.pageTitle > .grid-item-value');
            });

            it('displays the page title value as a single string', function () {
                expect($resultTitle.html().trim()).toEqual('iPad 2 3G - Apple');
            });
        });
    });

    describe('when a URL contains special characters', function () {
        var $result;

        beforeEach(function () {
            $result = component.find('pui-grid-list .item').eq(0);
        });

        it('properly displays the decoded characters', function () {
            expect($result.find('.url').text().trim()).toEqual('/fr/shop/product/MB110F/B/clavier-apple-avec-pavé-numérique-français');
        });
    });

    describe('description and description anatomy', function () {
        var $results;

        beforeEach(function () {
            $results = component.find('pui-grid-list .item');
        });
        describe('when a result has a descriptionAnatomy property', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(2).find('.grid-item-value');
            });

            it('displays the description in segments', function () {
                expect($resultTitle.find('.description-value').length).toEqual(2);
                expect($resultTitle.find('.description-value').eq(0).text().trim()).toEqual('store.seo.full.description');
            });

            it('displays a key path for each description segment', function () {
                expect($resultTitle.find('.description-anatomy-key-path > li').length).toEqual(2);
                expect($resultTitle.find('.description-anatomy-key-path > li').eq(0).text().trim()).toEqual('productMetaDescription');
            });

            describe('when the description anatomy type is text_asset', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('.description-anatomy-key-path > li').eq(0);
                });

                it('creates a link to the asset', function () {
                    expect($keyPath.find('a')).toBeVisible();
                    expect($keyPath.find('a').attr('href')).toEqual('https://storedev-pubsys.corp.apple.com/nemo/text-assets/store.seo.hyphen?version=integration');
                });

                it('displays a key icon next to the key path', function () {
                    expect($keyPath.find('.icon-key')).toBeVisible();
                });
            });

            describe('when the description anatomy type is product_attribute', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('.description-anatomy-key-path > li').eq(1);
                });

                it('displays an attribute icon next to the key path', function () {
                    expect($keyPath.find('.indicator-product-attribute')).toBeVisible();
                    expect($keyPath.find('.indicator-product-attribute').text().trim()).toEqual('a');
                });

                it('does not create a link', function () {
                    expect($keyPath.find('a')).not.toExist();
                });
            });

            describe('when a key path does not have a link property', function () {
                var $keyPaths;

                beforeEach(function () {
                    $keyPaths = $results.eq(4).find('.description-anatomy-key-path > li');
                });

                it('does not create an HTML link', function () {
                    $keyPaths.each(function () {
                        expect($(this).find('a').length).toEqual(0);
                    });
                });

                it('displays a key icon next to the key path', function () {
                    $keyPaths.each(function () {
                        expect($(this).find('.icon-key').length).toEqual(1);
                    });
                });
            });
        });

        describe('when a result does not have a descriptionAnatomy property', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(4).find('.description > .grid-item-value');
            });

            it('displays the description value as a single string', function () {
                expect($resultTitle.html().trim()).toEqual('Bacon ipsum dolor amet spare ribs duis strip steak ut. Spare ribs irure duis shank ad lorem filet mignon ipsum non chicken corned beef.');
            });
        });
    });
});
