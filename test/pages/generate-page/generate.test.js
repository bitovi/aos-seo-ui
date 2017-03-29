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
var envVars = require('seo-ui/utils/environmentVars');
var vm;
var $component;

require('seo-ui/pages/generate-page/generate-page');


//Renders the page 
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

        it('it has a default generateFilePath value', function () {
            expect(vm.attr('generateFilePath')).toBe(envVars.apiUrl() + '/process-publishing-ready-file.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
        });

        it('it has a default modalOpen value', function () {
            expect(vm.attr('modalOpen')).toBe(false);
        });

        describe('When modal link is clicked', function () {
            beforeEach(function () {
                $component.find('#generate-form .modal-trigger').trigger('click');
            });

            it('opens the Modal window', function () {
                expect($component.find('#formatting-requirements-modal-generate-url').length).toBeGreaterThan(0);
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
