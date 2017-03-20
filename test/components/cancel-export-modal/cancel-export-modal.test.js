var $ = require('jquery');
var can = require('can');

require('seo-ui/utils/viewHelpers');

var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./cancel-export-modal.test.stache');
var ViewModel = require('seo-ui/components/cancel-export-modal/cancel-export-modal.viewmodel');
var vm;

// Renders the component
var renderPage = function () {

    $('#sandbox').html(testTemplate({
        count: 1000
    }));

    jasmine.clock().runToLast();
    component = $('#sandbox seo-cancel-export-modal');
    vm = component.data('scope');
};

describe('Export Modal', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig({
            persistentSandbox: true
        });
    });

    afterEach(function () {
        jasmineConfigClean(true);
    });


    describe('Component', function () {
        beforeEach(function () {
            renderPage();
            component = $('#sandbox seo-cancel-export-modal');
            vm = component.data('scope');
        });

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });
    });
});