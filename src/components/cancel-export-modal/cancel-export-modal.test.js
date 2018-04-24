var $ = require('jquery');
var canViewModel = require('can-view-model');

var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./cancel-export-modal.test.stache');
var vm; // eslint-disable-line no-unused-vars

require('seo-ui/utils/viewHelpers');
require('./cancel-export-modal');

// Renders the component
var renderPage = function () {
    $('#sandbox').html(testTemplate({
        count: 1000
    }));

    jasmine.clock().runToLast();
    component = $('#sandbox seo-cancel-export-modal');
    vm = canViewModel(component);
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
            vm = canViewModel(component);
        });

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });
    });
});
