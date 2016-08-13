var $ = require('jquery');
var can = require('can');

require('seo-ui/utils/viewHelpers');

var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./export-urls.test.stache');
var ViewModel = require('seo-ui/components/export-urls/export-urls.viewmodel');
var vm;

// Renders the component
var renderPage = function () {

    $('#sandbox').html(testTemplate({
        count: 1000
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-export-urls');
    vm = component.data('scope');
};

describe('Export Urls', function () {
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
            component = $('#sandbox seo-export-urls');
            vm = component.data('scope');
        });

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });
    });
});
