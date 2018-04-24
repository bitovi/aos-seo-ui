var $ = require('jquery');
var canViewModel = require('can-view-model');

var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./user-menu.test.stache!');
var vm;

require('./user-menu');
require('can-fixture');

// Renders the component
var renderPage = function () {
    $('#sandbox').html(testTemplate({
        isLocalInstance: false,
        userData: {
            initials: 'MG'
        }
    }));

    jasmine.clock().runToLast();
    component = $('#sandbox seo-user-menu');
    vm = canViewModel(component);
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
