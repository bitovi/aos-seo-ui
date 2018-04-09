require('seo-ui/pages/request-detail/request-detail');
require('can/util/fixture/fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'request-detail',
    urlPath: ''
};

var testTemplate = require('./request-detail.test.stache!');
var ViewModel = require('seo-ui/pages/request-detail/request-detail.viewmodel');
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
    $component = $('#sandbox seo-request-detail');
};

describe('Request-detail', function () {
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
                    label: 'Part #',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'url',
                    label: 'URL',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'pageType',
                    label: 'Page Type',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'segment',
                    label: 'Segment',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'geo',
                    label: 'Region',
                    sorting: false
                },
                {
                    cssClass: 'col-md-3',
                    key: 'contents',
                    label: 'Asset Keys',
                    sorting: false
                }
            ]);
        });
    });

    describe('On load', function () {
        it('has page title', function () {
            expect($component.find('.page-header .pull-left').text().trim()).toEqual('Iphone X title');
        });
    });
});
