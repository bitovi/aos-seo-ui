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
        exportId: '73d5764c-388a-4566-b7cc-d847a1a4ef90',
        params: {},
        state: {
            countries: 'US,CA,XF,MX,BR',
            dateRanges: '',
            description: '',
            limit: 25,
            order: 'desc',
            page: 'url-list',
            pageNumber: 1,
            pageTitle: '',
            pageTypes: '',
            partNumber: 'VB005LL/A',
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
            window.seo = {
                'csrfToken': 'n3m0-r0ck5',
                'csrfHeader': 'X-AOS-CSRF',
                'csrfParameter': '_aos_csrf'
            };
            renderPage();

        });

        describe('buildParams()', function () {
            var params;

            beforeEach(function () {
                vm.attr('filterFields', ['countries']);
                vm.attr('searchFields', ['partNumber']);
                vm.buildParams();
                params = vm.attr('params');
            });

            it('adds the id parameter', function () {
                expect(params.attr('id')).toEqual('73d5764c-388a-4566-b7cc-d847a1a4ef90');
            });

            it('adds the limit parameter', function () {
                expect(params.attr('limit')).toEqual(25);
            });

            it('adds the page number parameter', function () {
                expect(params.attr('page')).toEqual(1);
            });

            it('adds the sort parameter', function () {
                expect(params.attr('sort')).toEqual('modifyDate desc');
            });

            it('adds the countries parameter', function () {
                expect(params.attr('countries')).toEqual('US,CA,XF,MX,BR');
            });

            it('adds the part number parameter', function () {
                expect(params.attr('partNumber')).toEqual('VB005LL/A');
            });

            describe('when passed a object containing extra parameters', function () {
                beforeEach(function () {
                    vm.buildParams({
                        nemoReady: true,
                        exportAll: false,
                        pageTypes: 'pdp'
                    });

                    params = vm.attr('params');
                });

                it('adds the nemoReady parameter', function () {
                    expect(params.attr('nemoReady')).toEqual(true);
                });

                it('adds the exportAll parameter', function () {
                    expect(params.attr('exportAll')).toEqual(false);
                });

                it('adds the pageTypes parameter', function () {
                    expect(params.attr('pageTypes')).toEqual('pdp');
                });
            });
        });

        describe('values/types of the export related properties', function () {

            it('has default value for notification', function () {
                expect(vm.attr('notifications').length).toBe(0);
            });

            it('has type of doExport function ', function () {
                expect(typeof vm.doExport).toBe('function');
            });

            it('has type of exportFilePath property ', function () {
                expect(typeof vm.exportFilePath).toBe('string');
            });

            it('has an initial doDownloadExport value', function () {
                expect(vm.attr('doDownloadExport')).toBe(false);
            });

            it('has an initial export file path value', function () {
                expect(vm.attr('exportFilePath')).toEqual(envVars.apiUrl() + '/export-urls.json');
            });
        });

        describe('when doExport called', function () {

            beforeEach(function () {
                vm.doExport();
            });

            it('shows the notification', function () {
                expect(vm.attr('notifications').length).toBe(1);
            });

        });

    });

    describe('component', function () {
        beforeEach(function () {
            window.seo = {
                'csrfToken': 'n3m0-r0ck5',
                'csrfHeader': 'X-AOS-CSRF',
                'csrfParameter': '_aos_csrf'
            };
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
                    expect($menuLinks.eq(1).text().trim()).toEqual('Export All (.csv)');
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

            describe('click the nemo ready option in the export options', function () {
                beforeEach(function () {
                    $menuLinks = $export.find('pui-action-bar-item a');
                    vm.attr('filterSearchApplied', false);
                    $export.find($menuLinks.eq(1)).trigger('click');
                });

                it('shows the notification that the export started', function () {
                    expect(vm.attr('notifications')[0].title).toEqual('Your data export has started.');
                });
            });
        });
    });
});
