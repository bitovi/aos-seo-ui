require('seo-ui/pages/edit-title-description-list/edit-title-description-list');
require('can/util/fixture/fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'edit-title-description-list',
    urlPath: ''
};

var testTemplate = require('./edit-title-description-list.test.stache!');
var ViewModel = require('seo-ui/pages/edit-title-description-list/edit-title-description-list.viewmodel');
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
    $component = $('#sandbox seo-edit-title-description-list');
};

describe('edit-title-description-list', function () {
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
    });

    describe('On load', function () {
        it('has page title', function () {
            expect($component.find('.page-header .pull-left').text().trim()).toEqual('Edit Title Description');
        });
    });

    describe('On load', function () {
        it('has total selected count text', function () {
            expect($component.find('.pull-right .total-count').text().trim()).toEqual('Total Selected Count:');
        });
    });

    describe('menu option', function () {
        beforeEach(function () {
            $component.find('.action.dropdown-toggle').trigger('click');
        });

        it('has cancel Request', function () {
            var menuOptionText = $component.find('pui-action-bar-item[action="cancelRequest"]').text().trim();
            expect(menuOptionText).toEqual('Cancel Request');
        });

        it('Add More', function () {
            var menuOptionText = $component.find('pui-action-bar-item[action="addMore"]').text().trim();
            expect(menuOptionText).toEqual('Add More');
        });
    });

    describe('header', function () {

        it('has part column', function () {
            expect($component.find('thead .table-header-main th:eq(0)').text().trim()).toEqual('Part #');
        });

        it('has url column', function () {
            expect($component.find('thead .table-header-main th:eq(1)').text().trim()).toEqual('URL');
        });

        it('has Page Title column', function () {
            expect($component.find('thead .table-header-main th:eq(2)').text().trim()).toEqual('Page Title');
        });

        it('has editable titles column', function () {
            expect($component.find('thead .table-header-main th:eq(3)').text().trim()).toEqual('Editable Titles');
        });

        it('has description titles column', function () {
            expect($component.find('thead .table-header-main th:eq(4)').text().trim()).toEqual('Description');
        });

        it('has editable description titles column', function () {
            expect($component.find('thead .table-header-main th:eq(5)').text().trim()).toEqual('Editable Description');
        });
    });
});
