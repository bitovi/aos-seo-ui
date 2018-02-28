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
var ViewModel = require('seo-ui/pages/request-list/request-list.viewmodel');
var vm;

// Renders the component
// Default state can be augmented by passing a parameter with the required changes
var renderPage = function (newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    jasmine.clock().runToLast();

    component = $('#sandbox seo-request-list');
    scope = component.data('scope');
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

        describe('has default scope value of ', function () {
            it('searchField', function () {
                expect(vm.attr('searchField')).toEqual('radarNumber');
            });
            it('searchValue', function () {
                expect(vm.attr('searchValue')).toEqual('');
            });
        });

        describe('has default scope value of ', function () {

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
        });
    });
});