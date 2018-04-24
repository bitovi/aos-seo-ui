require('../../app.less');

require('seo-ui/pages/request-detail/request-detail');
require('seo-ui/models/request-list/request-list.fixture');

var $ = require('jquery');
var assign = require('can-util/js/deep-assign/deep-assign');

var AppState = require('seo-ui/models/appstate/appstate');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'request-detail',
    requestPath: 'abb679fe-e016-44ad-bac5-33f86a71e775'
};

var testTemplate = require('./request-detail.test.stache!');
var ViewModel = require('seo-ui/pages/request-detail/request-detail.viewmodel');
var envVars = require('seo-ui/utils/environmentVars');
var vm;
var $component;

// Renders the page
var renderPage = function(newState, done) {
    state = new AppState(assign({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    $component = $('#sandbox seo-request-detail');

    jasmine.clock().runToLast();

    window.nativeSetTimeout(function (){
      done()
    })

};

describe('Request Detail', function () {
    beforeEach(function (done) {
        jasmineConfigClean = jasmineConfig();
        renderPage(null, done);
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
            expect($component.find('.page-header h1').text().trim()).toEqual('Iphone X title');
        });
    });

    describe('menu option', function () {

        beforeEach(function () {
            $component.find('.action.dropdown-toggle').trigger('click');
        });

        it('shows back to list page option', function () {
                var menuOptionText = $component.find('pui-action-bar-item[action="navigateToRequestList"]').text().trim();
                expect(menuOptionText).toEqual('Back to List page');
        });

        describe('Back to list page', function () {
            describe('on clicking', function () {
                var spyEvent;

                beforeEach(function () {
                    vm = $component.viewModel();
                    $component.find('.action.dropdown-toggle').trigger('click');
                    var backToListButton = $component.find('pui-action-bar-item[action="navigateToRequestList"]');
                    spyEvent = spyOnEvent(backToListButton, 'click');
                    backToListButton.trigger('click');
                });

                it('trigges the click event', function () {
                    expect(spyEvent).toHaveBeenTriggered();
                });
            });
        });
    });
});
