var $ = require('jquery'),
    can = require('can'),
    ViewModel = require('seo-ui/components/status-badges/status-badges.viewmodel'),
    testTemplate = require('./status-badges.test.stache');

var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;

var vm;
var component;
var scope;

// Renders the component
var renderPage = function () {

    $('#sandbox').html(testTemplate({
        status: 'Added'
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-status-badges');
    vm = component.data('scope');
};

describe('Status Badges', function () {
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
            $('#sandbox').html(testTemplate({
                status: 'Added'
            }));
            component = $('#sandbox seo-status-badges');
            vm = component.data('scope');
            jasmine.clock().tick(can.fixture.delay);
        });

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });

        it('Checks if the label is of correct color', function () {
            expect(component.find('span').css('background-color')).toEqual('rgba(40, 163, 63, 0.148438)');
        });

    });
});
