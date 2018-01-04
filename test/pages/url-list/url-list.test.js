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

    jasmine.clock().runToLast();

    component = $('#sandbox seo-url-list');
    scope = component.data('scope');
};

var testSort = function (name) {
    describe(name + ' field', function () {
        beforeEach(function () {
            // Ensures columns are visible before attempting to sort
            vm = can.viewModel(component);
            var column = _.find(vm.attr('columns'), {
                key: name
            });

            column.attr('isVisible', true);

            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');
            jasmine.clock().runToLast();
        });

        it('by clicking on the ' + name + ' sort button', function () {
            var ascVal = can.viewModel(component.find('pui-grid-list')).attr('items.0');
            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');
            jasmine.clock().runToLast();

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

        it('has an initial anatomyItem value', function () {
            expect(typeof vm.attr('anatomyItem')).toEqual('function');
        });

        it('has an initial columns value', function () {
            expect(vm.attr('columns').attr()).toEqual([
                {
                    cssClass: 'col-md-1',
                    key: 'selectUrl',
                    label: 'select'
                },
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
                    label: 'Type'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'status',
                    label: 'Status'
                },
                {
                    cssClass: 'col-md-2',
                    key: 'storeFrontAlias',
                    label: 'Store Front Alias'
                },
                {
                    cssClass: 'col-md-1',
                    key: 'nemoReadyRecord',
                    label: 'Nemo',
                    isHidden: true
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
            ]);
        });

        it('has an initial pageTitle value', function () {
            expect(vm.attr('pageTitle')).toEqual('SEO Metadata');
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

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(4);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: 'wifi'
                    });

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: '/ipod-nano/'
                    });

                    jasmine.clock().runToLast();

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

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(7);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: '3g'
                    });

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: 'MacBook Air - Apple'
                    });

                    jasmine.clock().runToLast();

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

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: 'IT department-level'
                    });

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: 'ipsum dolor'
                    });

                    jasmine.clock().runToLast();

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

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(2);
                });

                it('within a value', function () {
                    updateSearchTerm({
                        value: 'ZM'
                    });

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(9);
                });

                it('for a full value', function () {
                    updateSearchTerm({
                        value: 'Z0S9'
                    });

                    jasmine.clock().runToLast();

                    expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
                });
            });
        });

        describe('sorts by the', function () {
            testSort('country');
            testSort('description');
            testSort('nemoReadyRecord');
            testSort('pageTitle');
            testSort('partNumber');
            testSort('region');
            testSort('segment');
            testSort('status');
            testSort('url');
        });
    });

    describe('on clicking of checkbox',function () {
        beforeEach(function () {
            $allRow  = component.find('pui-grid-list tbody > tr').find("td input");
            $row  = component.find('pui-grid-list tbody > tr').eq(1).find("input");
            $header = component.find('pui-grid-list thead > tr').eq(0).find("input");
        });

        it('all row checkbox  is selected.', function () {
            $header.trigger("click");
            $allRow.each(function(index,row){
                expect($(row).is(':checked')).toEqual(true);
            });
        });

        it('header checkbox is unselected when any row checkbox is unselected.', function () {
            $row.trigger("click");
            expect($header.is(':checked')).toEqual(false);
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

        describe('when a result has a titleAnatomy property, and no pageTitle', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(4).find('.url-page-title');
            });

            it('does not display any content in the Page Title column', function () {
                expect($resultTitle.html().trim()).toEqual('');
            });
        });

        describe('when a result has a pageTitle property, and no titleAnatomy', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(7).find('.pageTitle > .grid-item-value');
            });

            it('displays the page title value as a single string', function () {
                expect($resultTitle.text().trim()).toEqual('iPod Nano - Apple');
            });
        });

        describe('when a result has both pageTitle and titleAnatomy properties', function () {
            var $popover;
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.eq(0).find('.pageTitle > .grid-item-value');
                $popover = $resultTitle.find('pui-popover');
            });

            it('displays the page title value as a single string', function () {
                expect($resultTitle.find('.url-page-title').html().trim()).toEqual('Achetez le Clavier USB Apple avec pavé numérique - Apple (FR)');
            });

            describe('title anatomy popover', function () {
                var titleAnatomy;

                beforeEach(function () {
                    titleAnatomy = scope.attr('items')[0].attr('titleAnatomy');
                });

                it('renders', function () {
                    expect($popover.length).toEqual(1);
                });

                it('has a width of 0', function () {
                    expect($popover.width()).toEqual(0);
                });

                it('has a height of 0', function () {
                    expect($popover.height()).toEqual(0);
                });

                describe('name element', function () {
                    var $names;

                    beforeEach(function () {
                        $names = $popover.find('.anatomy-name');
                    });

                    it('exists for every titleAnatomy item', function () {
                        expect($names.length).toEqual(titleAnatomy.length);
                    });

                    it('displays the correlating name for each item', function () {
                        $names.each(function (index) {
                            expect($(this).text().trim()).toEqual(titleAnatomy[index].attr('name'))
                        });
                    });
                });

                describe('value element', function () {
                    var $values;

                    beforeEach(function () {
                        $values = $popover.find('.anatomy-value');
                    });

                    it('exists for every titleAnatomy item', function () {
                        expect($values.length).toEqual(titleAnatomy.length);
                    });

                    it('displays the correlating value for each item', function () {
                        $values.each(function (index) {
                            expect($(this).text().trim()).toEqual(titleAnatomy[index].attr('value'))
                        });
                    });
                });
            });

            describe('title anatomy toggle button', function () {
                var $anatomyToggler;

                beforeEach(function () {
                    $anatomyToggler = $resultTitle.find('.toggle-anatomy');
                });

                it('is displayed', function () {
                    expect($anatomyToggler).toBeVisible();
                });

                describe('accessibility text', function () {
                    var $a11yText;

                    beforeEach(function () {
                        $a11yText = $anatomyToggler.find('.sr-only');
                    });

                    it('renders', function () {
                        expect($a11yText.text().trim()).toEqual('View Achetez le Clavier USB Apple avec pavé numérique - Apple (FR) title anatomy');
                    });

                    it('is one pixel wide', function () {
                        expect($a11yText.width()).toEqual(1);
                    });

                    it('is one pixel tall', function () {
                        expect($a11yText.height()).toEqual(1);
                    });
                });

                describe('when clicked once', function () {
                    beforeEach(function () {
                        $anatomyToggler.trigger('click');

                        $popover = $resultTitle.find('.popover');
                    });

                    it('displays the popover', function () {
                        expect($popover).toBeVisible();
                    });

                    it('inserts the popover content into a new element', function () {
                        expect($popover.find('.anatomy-list').length).toEqual(1);
                    });
                });

                describe('when clicked twice', function () {
                    beforeEach(function () {
                        $anatomyToggler.trigger('click');
                        $anatomyToggler.trigger('click');

                        $popover = $resultTitle.find('.popover');
                    });

                    it('removes the new popover element', function () {
                        expect($popover).not.toBeVisible();
                    });
                });
            });

            describe('when the title anatomy type is text_asset', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('dt').eq(0);
                });

                it('creates a link to the asset', function () {
                    expect($keyPath.find('a').attr('href')).toEqual('https://storedev-pubsys.corp.apple.com/nemo/text-assets/store.base_title?version=integration');
                });

                it('displays a key icon next to the key path', function () {
                    expect($keyPath.find('.icon-key').length).toEqual(1);
                });

                it('contains hidden accessibility text', function () {
                    expect($keyPath.find('.icon-key').text().trim()).toEqual('Key Path:');
                });
            });

            describe('when the title anatomy type is product-attribute', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('dt').eq(3);
                });

                it('displays an attribute icon next to the key path', function () {
                    expect($keyPath.find('.product-attribute').length).toEqual(1);
                });

                it('contains hidden accessibility text', function () {
                    expect($keyPath.find('.product-attribute').text().trim()).toEqual('Product Attribute:');
                });

                it('does not create a link', function () {
                    expect($keyPath.find('a')).not.toExist();
                });
            });

            describe('when the title anatomy type is node-data', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('dt').eq(4);
                });

                it('displays an attribute icon next to the key path', function () {
                    expect($keyPath.find('.node-data').length).toEqual(1);
                });

                it('contains hidden accessibility text', function () {
                    expect($keyPath.find('.node-data').text().trim()).toEqual('Node Data:');
                });

                it('does not create a link', function () {
                    expect($keyPath.find('a')).not.toExist();
                });
            });

            describe('when a key path does not have a link property', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultTitle.find('dt').eq(1);
                });

                it('does not create an HTML link', function () {
                    expect($keyPath.find('a').length).toEqual(0);
                });

                it('displays a key icon next to the key path', function () {
                    expect($keyPath.find('.icon-key').length).toEqual(1);
                });
            });

            describe('when a key-path string is wider than the popover', function () {
                beforeEach(function () {
                    $resultTitle.find('.toggle-anatomy').trigger('click');
                    $popover = $resultTitle.find('.popover');
                });

                it('wraps the key path within the popover', function () {
                    expect($popover.innerWidth()).toEqual($popover.get(0).scrollWidth);
                });
            });
        });

        describe('when a result has neither a pageTitle nor a titleAnatomy property', function () {
            var $resultTitle;

            beforeEach(function () {
                $resultTitle = $results.last().find('.url-page-title');
            });

            it('does not display any content in the Page Title column', function () {
                expect($resultTitle.html().trim()).toEqual('');
            });
        });
    });

    describe('description and description anatomy', function () {
        var $results;

        beforeEach(function () {
            $results = component.find('pui-grid-list .item');
        });

        describe('when a result has a descriptionAnatomy property, and no description', function () {
            var $resultDesc;

            beforeEach(function () {
                $resultDesc = $results.eq(13).find('.url-desc');
            });

            it('does not display any content in the Description column', function () {
                expect($resultDesc.html().trim()).toEqual('');
            });
        });

        describe('when a result has a description property, and no descriptionAnatomy', function () {
            var $resultDesc;

            beforeEach(function () {
                $resultDesc = $results.eq(4).find('.description > .grid-item-value');
            });

            it('displays the description value as a single string', function () {
                expect($resultDesc.text().trim()).toEqual('Bacon ipsum dolor amet spare ribs duis strip steak ut. Spare ribs irure duis shank ad lorem filet mignon ipsum non chicken corned beef.');
            });
        });

        describe('when a result has both description and descriptionAnatomy properties', function () {
            var $popover;
            var $resultDesc;

            beforeEach(function () {
                $resultDesc = $results.eq(0).find('.description > .grid-item-value');
                $popover = $resultDesc.find('pui-popover');
            });

            it('displays the description value as a single string', function () {
                expect($resultDesc.find('.url-desc').html().trim()).toEqual('Achetez le Clavier USB officiel d’Apple avec pavé numérique sur l’Apple Store en ligne. Envoi sous 24 heures.');
            });

            describe('description anatomy popover', function () {
                var descriptionAnatomy;

                beforeEach(function () {
                    descriptionAnatomy = scope.attr('items')[0].attr('descriptionAnatomy');
                });

                it('renders', function () {
                    expect($popover.length).toEqual(1);
                });

                it('has a width of 0', function () {
                    expect($popover.width()).toEqual(0);
                });

                it('has a height of 0', function () {
                    expect($popover.height()).toEqual(0);
                });

                describe('name element', function () {
                    var $names;

                    beforeEach(function () {
                        $names = $popover.find('.anatomy-name');
                    });

                    it('exists for every descriptionAnatomy item', function () {
                        expect($names.length).toEqual(descriptionAnatomy.length);
                    });

                    it('displays the correlating name for each item', function () {
                        $names.each(function (index) {
                            expect($(this).text().trim()).toEqual(descriptionAnatomy[index].attr('name'))
                        });
                    });
                });

                describe('value element', function () {
                    var $values;

                    beforeEach(function () {
                        $values = $popover.find('.anatomy-value');
                    });

                    it('exists for every descriptionAnatomy item', function () {
                        expect($values.length).toEqual(descriptionAnatomy.length);
                    });

                    it('displays the correlating value for each item', function () {
                        $values.each(function (index) {
                            expect($(this).text().trim()).toEqual(descriptionAnatomy[index].attr('value'))
                        });
                    });
                });
            });

            describe('description anatomy toggle button', function () {
                var $anatomyToggler;

                beforeEach(function () {
                    $anatomyToggler = $resultDesc.find('.toggle-anatomy');
                });

                it('is displayed', function () {
                    expect($anatomyToggler).toBeVisible();
                });

                describe('accessibility text', function () {
                    var $a11yText;

                    beforeEach(function () {
                        $a11yText = $anatomyToggler.find('.sr-only');
                    });

                    it('renders', function () {
                        expect($a11yText.text().trim()).toEqual('View Achetez le Clavier USB Apple avec pavé numérique - Apple (FR) description anatomy');
                    });

                    it('is one pixel wide', function () {
                        expect($a11yText.width()).toEqual(1);
                    });

                    it('is one pixel tall', function () {
                        expect($a11yText.height()).toEqual(1);
                    });
                });

                describe('when clicked once', function () {
                    beforeEach(function () {
                        $anatomyToggler.trigger('click');

                        $popover = $resultDesc.find('.popover');
                    });

                    it('displays the popover', function () {
                        expect($popover).toBeVisible();
                    });

                    it('inserts the popover content into a new element', function () {
                        expect($popover.find('.anatomy-list').length).toEqual(1);
                    });
                });

                describe('when clicked twice', function () {
                    beforeEach(function () {
                        $anatomyToggler.trigger('click');
                        $anatomyToggler.trigger('click');

                        $popover = $resultDesc.find('.popover');
                    });

                    it('removes the new popover element', function () {
                        expect($popover).not.toBeVisible();
                    });
                });
            });

            describe('when the description anatomy type is text_asset', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultDesc.find('dt').eq(0);
                });

                it('creates a link to the asset', function () {
                    expect($keyPath.find('a').attr('href')).toEqual('https://storedev-pubsys.corp.apple.com/nemo/text-assets/store.base_title?version=integration');
                });

                it('displays a key icon next to the key path', function () {
                    expect($keyPath.find('.icon-key').length).toEqual(1);
                });

                it('contains hidden accessibility text', function () {
                    expect($keyPath.find('.icon-key').text().trim()).toEqual('Key Path:');
                });
            });

            describe('when the description anatomy type is product-attribute', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultDesc.find('dt').eq(3);
                });

                it('displays an attribute icon next to the key path', function () {
                    expect($keyPath.find('.product-attribute').length).toEqual(1);
                });

                it('contains hidden accessibility text', function () {
                    expect($keyPath.find('.product-attribute').text().trim()).toEqual('Product Attribute:');
                });

                it('does not create a link', function () {
                    expect($keyPath.find('a')).not.toExist();
                });
            });

            describe('when the description anatomy type is node-data', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultDesc.find('dt').eq(4);
                });

                it('displays an attribute icon next to the key path', function () {
                    expect($keyPath.find('.node-data').length).toEqual(1);
                });

                it('contains hidden accessibility text', function () {
                    expect($keyPath.find('.node-data').text().trim()).toEqual('Node Data:');
                });

                it('does not create a link', function () {
                    expect($keyPath.find('a')).not.toExist();
                });
            });

            describe('when a key path does not have a link property', function () {
                var $keyPath;

                beforeEach(function () {
                    $keyPath = $resultDesc.find('dt').eq(1);
                });

                it('does not create an HTML link', function () {
                    expect($keyPath.find('a').length).toEqual(0);
                });

                it('displays a key icon next to the key path', function () {
                    expect($keyPath.find('.icon-key').length).toEqual(1);
                });
            });
        });

        describe('when a result has neither a description nor a descriptionAnatomy property', function () {
            var $resultDesc;

            beforeEach(function () {
                $resultDesc = $results.last().find('.url-desc');
            });

            it('does not display any content in the Description column', function () {
                expect($resultDesc.html().trim()).toEqual('');
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

    describe('when a page title contains multiple consecutive whitespace characters', function () {
        var $result;

        beforeEach(function () {
            $result = component.find('pui-grid-list .item').eq(5);
        });

        it('does not collapse the whitespace', function () {
            // The innerText property is the only way to test what the UI displays.
            expect($result.find('.url-page-title').get(0).innerText).toEqual('iPod Touch  -    Apple');
        });
    });

    describe('On intial load', function () {
        it('create request button is disabled', function () {
            expect(component.find('.create-request-button').attr('disabled')).toBe('disabled');
        });

        it('Deselect button is disabled', function () {
            expect(component.find('.deselect-all-button').attr('disabled')).toBe('disabled');
        });
    });

    describe('On selecting Url ', function () {

        beforeEach(function () {
            $row  = component.find('pui-grid-list tbody > tr').eq(1).find("input");
            $row.trigger("click");
            jasmine.clock().runToLast();
        });

        it('create request button is enabled', function () {
            expect(component.find('.create-request-button').attr('disabled')).not.toBe('disabled');
        });

        it('Deselect button is enabled', function () {
            expect(component.find('.deselect-all-button').attr('disabled')).not.toBe('disabled');
        });
    });

    describe('Create Request button', function () {
        it('renders', function () {
            expect(component.find('.create-request-button')).toExist();
        });

        it('has proper label', function () {
            expect(component.find('.create-request-button').text().trim()).toEqual('Create Request | 0');
        });
    });

    describe('create request select url count', function () {
        it('on load the count will be zero', function () {
            expect(component.find('.create-request-button').text().split("|")[1].trim()).toEqual('0');
        });

        it('selecting a row item increases the count ', function () {
            component.find('pui-grid-list tbody > tr').eq(1).find("input").trigger("click");
            expect(component.find('.create-request-button').text().split("|")[1].trim()).toEqual('1');
        });
    });

    describe('deselect button', function () { 
        it('has proper label', function () {
             expect(component.find('.deselect-all-button').text().trim()).toEqual('Deselect');
         });
    });

    describe('clicking on header checkbox', function () {

        beforeEach(function () {
            component.find('pui-grid-list .toggleSelect').click();
            jasmine.clock().runToLast();
        });

        it('select all row items', function () {
            var selectedItemsCount = component.find('.item input:checked').length;
            expect(component.find('.item input').length).toEqual(selectedItemsCount);
        });
    });

    describe('clicking on deselect button', function () {

        beforeEach(function () {
            component.find('pui-grid-list .toggleSelect').click();
            jasmine.clock().runToLast();
        });

        it('will clear all selected item', function () {
            component.find('.deselect-all-button').click();
            jasmine.clock().runToLast();
            expect(component.find('.item input:checked').length).toEqual(0);
        });
    });
});
