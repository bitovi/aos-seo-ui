require('seo-ui/pages/review-page/review-page');
require('can/util/fixture/fixture');

var AppState = require('seo-ui/models/appstate/appstate');
var $ = require('jquery');
var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;

var $component;
var state;
var stateObj = {
    page: 'review-page',
    urlPath: ''
};

var testTemplate = require('./review-page.test.stache!');
var ViewModel = require('seo-ui/pages/review-page/review-page.viewmodel');
var vm;

// Renders the page 
var renderPage = function (newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    jasmine.clock().tick(can.fixture.delay);

    $component = $('#sandbox seo-review-page');
};

describe('Review Page', function () {
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

        it('it has a default doDownloadExport value', function () {
            expect(vm.attr('doDownloadExport')).toBe(false);
        });

        it('it has a default fileToUpload value', function () {
            expect(vm.attr('fileToUpload')).toBe('');
        });

        it('it has a default modalOpen value', function () {
            expect(vm.attr('modalOpen')).toBe(false);
        });

        it('it has a default reviewFileFromInputPath value', function () {
            expect(vm.attr('reviewFileFromInputPath')).toBe(envVars.apiUrl() + '/process-for-textarea-input.json?');
        });

        it('it has a default reviewFilePath value', function () {
            expect(vm.attr('reviewFilePath')).toBe(envVars.apiUrl() + '/process-csv-url.json?');
        });

        it('it has a default startTab value', function () {
            expect(vm.attr('startTab')).toBe('Enter URLs');
        });

        it('it has a default tabsList value', function () {
            expect(vm.attr('tabsList').attr()).toEqual([{ name: 'Enter URLs'},{ name: 'Upload File'}]);
        });

        it('it has a default urlTexts value', function () {
            expect(vm.attr('urlTexts')).toBe('');
        });

        describe('When clearTextarea called', function () {
            beforeEach(function () {
                $component.find('#url-texts').val('abc');
                vm.clearTextarea();
                jasmine.clock().tick(can.fixture.delay);
            });

            it('clears textarea', function () {
                expect(vm.attr('urlTexts')).toBe('');
            });
        });

        describe('When doDownload called', function () {
            beforeEach(function () {
                vm.doDownload();
                jasmine.clock().tick(can.fixture.delay);
            });

            it('sets doDownloadExport property to false ', function () {
                expect(vm.attr('doDownloadExport')).toBe(false);
            });

            it('sets reviewFileFromInputPath property', function () {
                expect(vm.attr('reviewFileFromInputPath')).toBe(envVars.apiUrl() + '/process-for-textarea-input.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
            });
        });

        describe('When toggleModal called', function () {
            beforeEach(function () {
                vm.toggleModal();
                jasmine.clock().tick(can.fixture.delay);
            });

            it('opens Modal window', function () {
                expect(vm.attr('modalOpen')).toBe(true);
            });
        });
    });

    describe('Component', function () {
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
                expect($component.find('#do-download').attr('disabled')).toEqual('disabled');
            });

            it('shows Clear Field button as enabled', function () {
                expect($component.find('#clear-textarea').attr('disabled')).not.toBe('disabled');
            });

            it('shows Textarea empty', function () {
                expect($component.find('#url-texts').val()).toBe('');
            });
        });

        describe('When Upload File tab is clicked', function () {
            beforeEach(function () {
                $component.find('.nav-tabs li:eq(1) a').trigger('click');
                jasmine.clock().tick(can.fixture.delay);
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

            describe('When formatting requirements link is clicked', function () {
                beforeEach(function () {
                    $component.find('#review-file-form .btn-link').trigger('click');
                    jasmine.clock().tick(can.fixture.delay);
                });

                it('opens Formatting Requirements Modal', function () {
                    expect($component.find('#formatting-requirements-modal-review-url')).toBeVisible();
                });
            });
        });
    });
});
