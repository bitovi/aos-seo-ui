require('../../app.less');
require('seo-ui/models/request-list/request-list.fixture');

var $ = require('jquery');
var assign = require('can-util/js/deep-assign/deep-assign');
var canViewModel = require('can-view-model');
var AppState = require('seo-ui/models/appstate/appstate');
var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'request-list',
    urlPath: ''
};
var testTemplate = require('./request-list.test.stache!');
var requestListPage = require('seo-ui/pages/request-list/request-list');
var requestModel = require('seo-ui/models/request-list/request-list');
var ViewModel = require('seo-ui/pages/request-list/request-list.viewmodel');
var vm;

// Renders the component
// Default state can be augmented by passing a parameter with the required changes
var renderPage = function (newState) {
    state = new AppState(assign({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        model: requestModel,
        state: state
    }));

    jasmine.clock().runToLast();

    component = $('#sandbox seo-request-list');
    vm = canViewModel(component);
};

var testSort = function (name) {
    describe(name + ' field', function () {
        beforeEach(function (done) {
            // Ensures columns are visible before attempting to sort
            vm = canViewModel(component);
            var column = _.find(vm.attr('columns'), {
                key: name
            });

            column.attr('isVisible', true);

            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');

            // THEORY: Render
            jasmine.clock().runToLast();

            // Yield to DOM manipulation (big list of items)
            window.nativeSetTimeout(function () {

              // THEORY: Update bindings influenced by with the render
              jasmine.clock().runToLast();
              done()
            })
        });

        it('by clicking on the ' + name + ' sort button', function (done) {
            var ascVal = canViewModel(component.find('pui-grid-list')).attr('items.0');
            console.log('Toggle')
            component.find('pui-grid-list .' + name + ' .order-toggle').trigger('click');

            // THEORY: Render
            jasmine.clock().runToLast();

            // Yield to DOM manipulation (big list of items)
            window.nativeSetTimeout(function () {

                // THEORY: Update bindings influenced by with the render
                jasmine.clock().runToLast();

                var descVal = canViewModel(component.find('pui-grid-list')).attr('items.0');

                expect(ascVal.attr('id')).not.toEqual(descVal.attr('id'));
                done()
            }, 1)
        });
    });
};

var updateSearchTerm = function (opts) {
    var txtField;
    var isMulti = opts.multi || false;
    var doSubmit = opts.submit || true;
    var events, evt, evtTwo;

    if (isMulti) {
        txtField = component.find('pui-grid-multi-search #txt-' + opts.key);
        evt = $.Event("keyup");
        evt.which = 13;
        events = [evt];
    } else {
        txtField = component.find('pui-grid-search input');
        evt = $.Event("input");
        evtTwo = $.Event("change");
        events = [evt, evtTwo];
    }
    txtField.val(opts.value);
    events.forEach(function (evt) {
        txtField.trigger(evt);
    });

    if (doSubmit) {
        if (isMulti) {
            component.find('pui-grid-multi-search .btn-multisearch').trigger('click');
        } else {
            component.find('pui-grid-search .btn-search').trigger('click');
        }
    }
};

describe('Request List Page', function () {
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
                    key: 'radarNumber',
                    label: 'Radar Number',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'radarTitle',
                    label: 'Radar Title',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'radarDescription',
                    label: 'Radar Description',
                    sorting: true
                },
                {
                    cssClass: 'col-md-1',
                    key: 'state',
                    label: 'State',
                    sorting: true
                },
                {
                    cssClass: 'col-md-1',
                    key: 'subState',
                    label: 'Sub State',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'createUser',
                    label: 'Create User',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'createDate',
                    label: 'Create Date',
                    sorting: true
                }
            ]);
        });

        it('has an initial dataOptions value', function () {
            expect(vm.attr('dataOptions').attr()).toEqual([
                {
                    key: 'radarNumber',
                    label: 'Radar Number'
                },
                {
                    key: 'radarTitle',
                    label: 'Radar Title'
                },
                {
                    key: 'radarDescription',
                    label: 'Radar Description'
                },{
                    key: 'state',
                    label: 'State'
                },{
                    key: 'subState',
                    label: 'Sub State'
                },{
                    key: 'createUser',
                    label: 'Create User'
                }
            ]);
        });

        it('has an initial pageTitle value', function () {
            expect(vm.attr('title')).toEqual('Request List');
        });

        it('has an initial searchField value', function () {
            expect(vm.attr('searchField')).toEqual('radarNumber');
        });

        it('has a URL model property', function () {
            expect(vm.attr('model')).toExist();
        });
    });

    describe('component', function () {
        it('renders URL list results', function () {
            expect(component.find('pui-grid-list tbody > tr').length).toBeGreaterThan(0);
        });
    });

    describe('sorts by the', function () {
        testSort('radarNumber');
        testSort('radarTitle');
        testSort('radarDescription');
        testSort('state');
        testSort('subState');
        testSort('createUser');
    });

    describe('advanced search', function() {
        beforeAll(function() {
            component.find('.btn-adv-search').trigger('click');
        });

        it('search button enabled', function() {
            updateSearchTerm({
                multi: true,
                key: 'radarNumber',
                value: '101897'
            });

            jasmine.clock().runToLast();
            expect(component.find('pui-grid-multi-search .btn-multisearch').is(":disabled")).toBe(false);
        });

        it('checks value in nodePath input', function() {
            updateSearchTerm({
                multi: true,
                key: 'radarNumber',
                value: '101897'
            });

            jasmine.clock().runToLast();
            expect(component.find('pui-grid-multi-search #txt-radarNumber').val()).toEqual('101897');
        });

        it('checks the last edited by value', function() {
            updateSearchTerm({
                multi: true,
                key: 'radarTitle',
                value: 'test678'
            });

            jasmine.clock().runToLast();
            expect(component.find('pui-grid-multi-search #txt-radarTitle').val()).toEqual('test678');
        });

        it('cancel button is clicked', function() {
            updateSearchTerm({
                multi: true,
                key: 'radarNumber',
                value: '101897',
                submit: false
            });

            component.find('pui-grid-multi-search .btn-multisearch-cancel').trigger('click');
            expect(component.find('pui-grid-multi-search #txt-radarNumber').val()).toEqual('');
            jasmine.clock().runToLast();
        });
    });

    describe('search is made on', function(){
        beforeEach(function() {
            vm.attr('searchField', 'radarNumber');
            // reset search results
            var searchValue = component.find('pui-grid-search .search-text').val();
            if (searchValue) {
                component.find('pui-grid-search .input-reset').trigger('click');
            }
        });

        it('radarNumber', function() {
            updateSearchTerm({
                value: '101897'
            });

            jasmine.clock().runToLast();

            expect(component.find('pui-grid-list tbody > tr').length).toEqual(1);
        });
    });
});

