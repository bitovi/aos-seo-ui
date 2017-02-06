var $ = require('jquery');
var can = require('can');

var component;
var scope;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./user-menu.test.stache!');
var ViewModel = require('seo-ui/components/user-menu/user-menu.viewmodel');
var vm;

require('seo-ui/components/user-menu/user-menu');
require('can/util/fixture/fixture');

// Renders the component
var renderPage = function () {
    $('#sandbox').html(testTemplate({
        isLocalInstance: false,
        userData: {
        	initials: "MG"
        }
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-user-menu');
    vm = can.viewModel(component);
};

describe('User-menu', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig({
            persistentSandbox: true
        });
    });

    afterEach(function () {
        jasmineConfigClean(true);
    });

    describe('view model', function () {
    	beforeEach(function () {
            renderPage();
        });

        describe('isLocalInstance property', function () {
            it('has type of boolean', function () {
                expect(typeof vm.attr('isLocalInstance')).toBe('boolean');
            });
        });

        describe('toggleFixtures()', function () {
            it('has type of function', function () {
                expect(typeof vm.toggleFixtures).toBe('function');
            });
        });
    });

});