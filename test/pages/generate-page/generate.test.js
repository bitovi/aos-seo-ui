require('seo-ui/pages/generate-page/generate-page');
require('can/util/fixture/fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'generate-page',
    urlPath: ''
};

var testTemplate = require('./generate.test.stache!');
var ViewModel = require('seo-ui/pages/generate-page/generate-page.viewmodel');
var ExportProgressModel = require('seo-ui/models/export-progress/export-progress');
var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var envVars = require('seo-ui/utils/environmentVars');
var vm;
var $component;

// Renders the page
var renderPage = function(newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    jasmine.clock().runToLast();
    $component = $('#sandbox seo-generate-page');
};

describe('Generate Page', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig();
        window.seo = {
            csrfHeader:"X-AOS-CSRF",
            csrfParameter:"_aos_csrf",
            csrfToken:"n3m0-r0ck5"
        };
        renderPage();
    });

    afterEach(function () {
        jasmineConfigClean();
    });

    describe('View Model', function () {
        beforeEach(function () {
            vm = new ViewModel();
        });

        it('has a default exportId value', function () {
            expect(vm.attr('exportId')).toBe('');
        });

        it('has an ExportProgressModel property with type function', function () {
            expect(typeof vm.attr('ExportProgressModel')).toBe('function');
        });

        it('has a default fileToUpload value', function () {
            expect(vm.attr('fileToUpload')).toBe('');
        });

        it('has a GenerateExportIdModel property with type function', function () {
            expect(typeof vm.attr('GenerateExportIdModel')).toBe('function');
        });

        it('has a default generateFilePath value', function () {
            expect(vm.attr('generateFilePath')).toBe(envVars.apiUrl() + '/process-publishing-ready-file.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
        });

        it('has a default modalOpen value', function () {
            expect(vm.attr('modalOpen')).toBe(false);
        });

        it('has a notifications Array property with a length of 0', function () {
            expect(vm.attr('notifications').length).toBe(0);
        });

        describe('When modal link is clicked', function () {
            beforeEach(function () {
                $component.find('#generate-form .modal-trigger').trigger('click');
            });

            it('opens the Modal window', function () {
                expect($component.find('#formatting-requirements-modal-generate-url').length).toBeGreaterThan(0);
            });
        });

        describe('When getProgress function is called', function () {
            beforeEach(function () {
                vm.getProgress();
                spyOn(vm, 'getProgress');
                jasmine.clock().runToLast();
            });

            it('adds a notifications message', function () {
                expect(vm.attr('notifications').attr()).toEqual([{
                    title: 'Your data export has started.',
                    message: 'Please wait for the process to complete.',
                    timeout: '5000',
                    type: 'info'
                }]);
            });
        });
    });

    describe('Component', function () {
        it('shows a Header', function () {
            expect($component.find('h1').text()).toBe('Generate Publishing-Ready File');
        });

        it('shows Generate Form', function () {
            expect($component.find('#generate-form').length).toBeGreaterThan(0);
        });

        describe('Choose File Button', function () {
            it('should be visible on the page', function () {
                expect($component.find('.file-upload')).toBeVisible();
            });
        });

        describe('Generate File Button', function () {
            it('should be disabled', function () {
                expect($component.find('#generate-form .btn-primary').text().length).toBeGreaterThan(0);
            });

            it('shows file upload button disabled', function () {
                expect($component.find('#generate-form .btn-primary').attr('disabled')).toBe('disabled');
            });
        });
    });
});
