var $ = require('jquery');
var can = require('can');

var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./fixture-toggle.test.stache!');
var ViewModel = require('seo-ui/components/fixture-toggle/fixture-toggle.viewmodel');
var vm;

// Renders the component
var renderPage = function () {
    $('#sandbox').html(testTemplate({}));

    jasmine.clock().runToLast();
    component = $('#sandbox seo-fixture-toggle');
    vm = can.viewModel(component);
};

describe('Fixture Toggle', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig({
            persistentSandbox: true
        });

        window.seo = {
            'csrfToken': 'n3m0-r0ck5',
            'csrfHeader': 'X-AOS-CSRF',
            'csrfParameter': '_aos_csrf'
        };

        renderPage();
    });

    afterEach(function () {
        jasmineConfigClean(true);
    });

    describe('view model', function () {
        describe('fixturesOn property', function () {
            it('has default value', function () {
                expect(vm.fixturesOn).toBe(true);
            });
        });

        describe('status property', function () {
            it('has no default value', function () {
                expect(vm.status).toBe(undefined);
            });
        });

        describe('toggle()', function () {
            it('is a function', function () {
                expect(typeof vm.toggle).toBe('function');
            });
        });
    });

    describe('Component', function () {
    	// Disabling this test to avoid infinite loop. turning the fixtures off 
    	// reloads the page every time, so this would never end
    	xdescribe('toggle function', function () {
    		beforeEach(function () {
    			$('seo-fixture-toggle .fixtures-badge').trigger('click');
    		});

            it('turns fixtures off', function () {
                expect(vm.fixturesOn).toBe(false);
            });
        });
    });
});
