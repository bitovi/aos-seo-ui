require('seo-ui/pages/request-list/request-list');
require('can/util/fixture/fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'request-list',
    urlPath: ''
};

var testTemplate = require('./request-list.test.stache!');
var ViewModel = require('seo-ui/pages/request-list/request-list.viewmodel');
var envVars = require('seo-ui/utils/environmentVars');
var vm;
var $component;

// Renders the page
var renderPage = function(newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    jasmine.clock().runToLast();
    $component = $('#sandbox seo-request-list');
};

describe('request-list', function () {
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
    });

    describe('On load', function () {
        it('has page title', function () {
            expect($component.find('.page-header').text().trim()).toEqual('Request List');
        });
    });

    describe('On load', function () {
        it('has page title', function () {
            expect($component.find('.page-header').text().trim()).toEqual('Request List');
        });
    });
});
