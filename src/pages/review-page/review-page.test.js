require('../../app.less!');
require('./review-page');
require('can-fixture');

var domEvents = require("can-util/dom/events/events");

var $ = require('jquery');
var assign = require('can-util/js/deep-assign/deep-assign');
var canViewModel = require('can-view-model');

var AppState = require('seo-ui/models/appstate/appstate');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var state;
var stateObj = {
    page: 'review-page',
    urlPath: ''
};

var testTemplate = require('./review-page.test.stache!');
var ViewModel = require('./review-page.viewmodel');
var envVars = require('seo-ui/utils/environmentVars');
var vm;
var $component;

// Renders the page
var renderPage = function (newState) {
    state = new AppState(assign({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    jasmine.clock().runToLast();

    $component = $('#sandbox seo-review-page');
};

describe('Review Page', function () {
    beforeEach(function () {
        jasmineConfigClean = jasmineConfig();
        window.seo = {
            csrfHeader: 'X-AOS-CSRF',
            csrfParameter: '_aos_csrf',
            csrfToken: 'n3m0-r0ck5'
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

        it('has a default doDownloadExport value', function () {
            expect(vm.attr('doDownloadExport')).toBe(false);
        });

        it('has a default downloadBtnEnabled value', function () {
            expect(vm.attr('downloadBtnEnabled')).toBe(false);
        });

        it('has a default exportId value', function () {
            expect(vm.attr('exportId')).toBe('');
        });

        it('has an ExportProgressModel property with type function', function () {
            expect(typeof vm.attr('ExportProgressModel')).toBe('function');
        });

        it('has a default exportRequest value', function () {
            expect(vm.attr('exportRequest')).toBe('{}');
        });

        it('has a default fileToUpload value', function () {
            expect(vm.attr('fileToUpload')).toBe('');
        });

        it('has a GenerateExportIdModel property with type function', function () {
            expect(typeof vm.attr('GenerateExportIdModel')).toBe('function');
        });

        it('has a default modalOpen value', function () {
            expect(vm.attr('modalOpen')).toBe(false);
        });

        it('has a notifications Array property with a length of 0', function () {
            expect(vm.attr('notifications').length).toBe(0);
        });

        it('has a params property with type Object', function () {
            expect(typeof vm.attr('params')).toBe('object');
        });

        it('has a default reviewFileFromInputPath value', function () {
            expect(vm.attr('reviewFileFromInputPath')).toBe(envVars.apiUrl() + '/process-for-textarea-input.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
        });

        it('has a default reviewFilePath value', function () {
            expect(vm.attr('reviewFilePath')).toBe(envVars.apiUrl() + '/process-csv-url.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
        });

        it('has a default startTab value', function () {
            expect(vm.attr('startTab')).toBe('Enter URLs');
        });

        it('has a default tabsList value', function () {
            expect(vm.attr('tabsList').attr()).toEqual([{name: 'Enter URLs'}, {name: 'Upload File'}]);
        });

        it('has a default urlTexts value', function () {
            expect(vm.attr('urlTexts')).toBe('');
        });

        describe('When buildParams function is called', function () {
            beforeEach(function () {
                vm.buildParams();
                jasmine.clock().runToLast();
            });

            it('sets params.urlTexts property', function () {
                expect(vm.attr('params.urlTexts')).toBeDefined();
            });

            it('sets params.exportId property', function () {
                expect(vm.attr('params.exportId')).toBeDefined();
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

        describe('When toggleModal function is called', function () {
            beforeEach(function () {
                vm.toggleModal();
                jasmine.clock().runToLast();
            });

            it('opens Modal window', function () {
                expect(vm.attr('modalOpen')).toBe(true);
            });
        });

        describe('When updateUrlText function is called', function () {
            beforeEach(function () {
                vm.updateUrlText('abc');
                jasmine.clock().runToLast();
            });

            it('sets urlTexts property to the same value as what the textarea has', function () {
                expect(vm.attr('urlTexts')).toBe('abc');
            });
        });
    });

    describe('Component', function () {
        beforeEach(function () {
            vm = canViewModel($component);
        });

        describe('When Review Page renders', function () {
            it('renders Review file form', function () {
                expect($component.find('#review-file-form').length).toBeGreaterThan(0);
            });

            it('shows Enter URLs tab by default', function () {
                expect($component.find('#enter-urls')).toBeVisible();
            });

            it('hides Upload File tab by default', function () {
                expect($component.find('#upload-file')).not.toBeVisible();
            });

            it('shows Generate file button as disabled', function () {
                expect($component.find('#review-file-from-input-btn').attr('disabled')).toEqual('disabled');
            });

            it('shows Clear Field button as enabled', function () {
                expect($component.find('#clear-textarea').attr('disabled')).not.toBe('disabled');
            });

            it('shows Textarea empty', function () {
                expect($component.find('#url-texts').val()).toBe('');
            });

            describe('When Clear Field button clicked', function () {
                beforeEach(function () {
                    $component.find('#url-texts').val('abc')
                    domEvents.dispatch.call($component.find('#url-texts')[0], 'change')
                    domEvents.dispatch.call($component.find('#clear-textarea')[0], 'click')
                });

                it('clears textarea', function () {
                    expect($component.find('#url-texts').val()).toBe('');
                });
            });

            describe('When keyup event is triggered inside #url-texts textarea', function () {
                beforeEach(function () {
                    var evt = new $.Event('keyup');
                    $component.find('#url-texts').val('abcd');
                    evt.which = 27;
                    domEvents.dispatch.call($component.find('#url-texts')[0], 'keyup');
                });

                it('sets urlTexts property to the same value as what the textarea has', function () {
                    expect(vm.attr('urlTexts')).toBe('abcd');
                });
            });
        });

        describe('When Upload File tab is clicked', function () {
            beforeEach(function () {
                $component.find('.nav-tabs li:eq(1) a').trigger('click');
                jasmine.clock().runToLast();
            });

            it('shows Upload File tab', function () {
                expect($component.find('#upload-file')).toBeVisible();
            });

            it('shows file upload button', function () {
                expect($component.find('.file-upload')).toBeVisible();
            });

            it('shows Generate File button', function () {
                expect($component.find('#review-file-form .btn-primary')).toBeVisible();
            });

            it('shows Generate File button disabled', function () {
                expect($component.find('#review-file-form .btn-primary').attr('disabled')).toBe('disabled');
            });

            // This test somehow triggers a submission of the #review-file-form,
            // which causes Jasmine to hang, since the form action has no
            // associated fixture. Disabling for now.
            xdescribe('When formatting requirements link is clicked', function () {
                beforeEach(function () {
                    $component.find('#review-file-form .btn-link').trigger('click');
                    jasmine.clock().runToLast();
                });

                it('opens Formatting Requirements Modal', function () {
                    expect($component.find('#formatting-requirements-modal-review-url')).toBeVisible();
                });
            });
        });
    });
});
