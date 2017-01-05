var $ = require('jquery');
var can = require('can');

require('seo-ui/utils/viewHelpers');

var component;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./export-urls.test.stache');
var ViewModel = require('seo-ui/components/export-urls/export-urls.viewmodel');
var envVars = require('seo-ui/utils/environmentVars');
var vm;

// Renders the component
var renderPage = function () {
    $('#sandbox').html(testTemplate({
        state: {
            countries: '',
            dateRanges: '',
            description: '',
            limit: 25,
            order: 'desc',
            page: 'url-list',
            pageNumber: 1,
            pageTitle: '',
            partNumber: '',
            regions: '',
            segments: '',
            sort: 'modifyDate',
            statuses: '',
            url: ''
        }
    }));

    jasmine.clock().tick(can.fixture.delay);
    component = $('#sandbox seo-export-urls');
    vm = can.viewModel(component);
};

describe('Export URLs', function () {
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

        it('has an initial doDownloadExport value', function () {
            expect(vm.attr('doDownloadExport')).toEqual(false);
        });

        it('has an initial export file path value', function () {
            expect(vm.attr('exportFilePath')).toEqual(envVars.apiUrl() + '/export-urls.json');
        });

        it('building the params method', function () {
            vm.buildParams();
            expect(vm.attr('params.sort')).toEqual('modifyDate desc');
        });

    });

    describe('component', function () {
        beforeEach(function () {
            renderPage();
        });

        it('renders', function () {
            expect(component.length).toBeGreaterThan(0);
        });

        describe('drop-down menu', function () {
            var $export;
            var $menuLinks;

            beforeEach(function () {
                $export = component.find('pui-action-bar-menu');
                $export.find('.dropdown-toggle').trigger('click');
            });

            afterEach(function () {
                $export.find('.dropdown-toggle').trigger('click');
            });

            it('has a menu header', function () {
                expect($export.find('.dropdown-header').text().trim()).toEqual('Export URLs:');
            });

            describe('when applying a filter or search term', function () {
                beforeEach(function () {
                    vm.attr('filterSearchApplied', true);
                    $menuLinks = $export.find('pui-action-bar-item a');
                });

                it('has three option links', function () {
                    expect($menuLinks.length).toEqual(3);
                });

                it('has a Current View option', function () {
                    expect($menuLinks.eq(0).text().trim()).toEqual('Current View');
                });

                it('has an Export All option', function () {
                    expect($menuLinks.eq(1).text().trim()).toEqual('Export All');
                });

                it('has an Nemo-Ready option', function () {
                    expect($menuLinks.eq(2).text().trim()).toEqual('Nemo-Ready File');
                });
            });

            describe('when no filter or search term is applied', function () {
                beforeEach(function () {
                    vm.attr('filterSearchApplied', false);
                    $menuLinks = $export.find('pui-action-bar-item a');
                });

                it('has two option links', function () {
                    expect($menuLinks.length).toEqual(2);
                });

                it('has a Current View option', function () {
                    expect($menuLinks.eq(0).text().trim()).toEqual('Current View');
                });

                it('has an Nemo-Ready option', function () {
                    expect($menuLinks.eq(1).text().trim()).toEqual('Nemo-Ready File');
                });
            });

            describe('when there are no URL results', function () {
                beforeEach(function () {
                    vm.attr('items', []);
                });

                it('disables the export button', function () {
                    expect($export.find('pui-action-bar-dropdown').attr('disabled')).toEqual('disabled');
                });
            });
        });
    });
});
