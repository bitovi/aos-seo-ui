var $ = require('jquery');
var can = require('can');

require('seo-ui/models/url/url.fixture.js');
require('seo-ui/utils/viewHelpers.js');

var AppState = require('seo-ui/models/appstate/appstate.js');
var component;
var jasmineConfig = require('test/jasmine-configure.js');
var jasmineConfigClean;
var Model = require('seo-ui/models/url/url');
var rowTemplate = require('seo-ui/pages/url-list/row.stache');
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
var ViewModel = require('seo-ui/components/list-page/list-page.viewmodel.js');
var vm;

// Renders the component
// Default state can be augmented by passing a parameter with the required changes
var renderPage = function (newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        model: Model,
        state: state,
        rowTemplate: function () {
            return rowTemplate;
        },
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
                var title = vm.attr('title');
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

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });

        it('Displays alert if storage delayedAlert set', function () {
            expect(vm.attr('state.alert.type')).toEqual('success');
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
