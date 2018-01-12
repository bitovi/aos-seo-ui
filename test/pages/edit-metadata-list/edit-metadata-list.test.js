require('seo-ui/pages/edit-metadata-list/edit-metadata-list');
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

var testTemplate = require('./edit-metadata-list.test.stache!');
var ViewModel = require('seo-ui/pages/edit-metadata-list/edit-metadata-list.viewmodel');
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
    $component = $('#sandbox seo-edit-metadata-list');
};

describe('edit-metadata-list', function () {
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
                    key: 'partNumber',
                    label: 'Part #',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'url',
                    label: 'URL',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'pageTitle',
                    label: 'Page Title',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'editablepagetitle',
                    label: 'Editable Titles',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'description',
                    label: 'Description',
                    sorting: false
                },
                {
                    cssClass: 'col-md-4',
                    key: 'editabledescription',
                    label: 'Editable Description',
                    sorting: false
                }
            ]);
        });
    });

    describe('On load', function () {
        it('has page title', function () {
            expect($component.find('.page-header .pull-left').text().trim()).toEqual('Edit Metadata List');
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

        it('has Add More', function () {
            var menuOptionText = $component.find('pui-action-bar-item[action="addMore"]').text().trim();
            expect(menuOptionText).toEqual('Add More');
        });

        it('has raiserequest', function () {
            var menuOptionText = $component.find('pui-action-bar-item[action="raiseRequest"]').text().trim();
            expect(menuOptionText).toEqual('Raise Request');
        });
    });

    describe('when the raise request is clicked', function () {
        beforeEach(function () {
            $component.find('.action.dropdown-toggle').trigger('click');
            jasmine.clock().runToLast();
            $component.find('pui-action-bar-item[action="raiseRequest"]').trigger('click');
        });

        it('opens the raise request modal', function () {
            expect($component.find('pui-modal')).toBeVisible();
        });
    });

    describe('when raise request modal as clicked', function () {
        beforeEach(function () {
            $component.find('.action.dropdown-toggle').trigger('click');
            jasmine.clock().runToLast();
            $component.find('pui-action-bar-item[action="raiseRequest"]').trigger('click');
        });

        it('has title', function () {
            expect($component.find('.modal-title').text().trim()).toEqual('Raise Reqest');
        });

        it('has submit request button', function () { 
            expect($component.find('.btn-block').text().trim()).toEqual('Submit Request');
        });
    });
});
