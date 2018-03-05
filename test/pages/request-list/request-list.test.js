require('seo-ui/models/request-list/request-list.fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var scope;
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
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        model: requestModel,
        state: state
    }));

    jasmine.clock().runToLast();

    component = $('#sandbox seo-request-list');
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
});
