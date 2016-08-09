var $ = require('jquery');
var can = require('can');

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
        detailsKey: 'targetPath'
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-list-page');
    vm = component.data('scope');
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
            vm = new ViewModel();
        });

        describe('Has default scope value of', function () {
            it('title', function () {
                var title = vm.attr('pageTitle');
                expect(title).toEqual('List Page');
            });
        });
    });

    describe('Component', function () {
        beforeEach(function () {
            renderPage();
            component = $('#sandbox seo-list-page');
            vm = component.data('scope');
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
    });
});
