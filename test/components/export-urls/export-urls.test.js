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
        state: {
            countries: "",
            dateRanges: "",
            limit: 25,
            order: "asc",
            pageNumber: 1,
            pageTitle: "",
            partNumber: "",
            regions: "",
            segments: "",
            sort: "partNumber",
            statuses: "",
            url: ""
        }
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-export-urls');
    vm = can.viewModel(component);;
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
        });

        it('Renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });


        describe('ExportAll and Current View display', function () {
            beforeEach(function () {
                component.find('pui-action-bar-menu .dropdown-toggle').click();
            });

            it('Checks if menu header and options are available', function () {
                expect(component.find('.dropdown-header').html()).toContain('Export');
                expect(component.find('pui-action-bar-item:eq(1)').html()).toContain('Current View');
            });

            it('Checks for the export dropdown options', function () {
                expect(component.find('pui-action-bar-item').length).toEqual(2);
                vm.attr('state.statuses', 'new-to-store');
                expect(component.find('pui-action-bar-item').length).toEqual(3);
            });

            it('Checks for the exportAll Option is present or not', function () {
                debugger;
                vm.attr('state.url', '/ipod-classic/');
                vm.attr('state.statuses', 'modified');
                expect(component.find('pui-action-bar-item:eq(2)').text()).toContain('Export All');
            });

        });
    });
});
