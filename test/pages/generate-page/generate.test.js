require('can/util/fixture/fixture');

var $ = require('jquery');
var can = require('can');

var AppState = require('seo-ui/models/appstate/appstate');
var component; 
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var scope;
var state;
var stateObj = {
    page: 'generate-page',
    urlPath: ''
};

var testTemplate = require('./generate.test.stache!');
var ViewModel = require('seo-ui/pages/generate-page/generate-page.viewmodel');
var envVars = require('seo-ui/utils/environmentVars');
var vm;

require('seo-ui/pages/generate-page/generate-page');


//Renders the page 
var renderPage = function(newState) {
    state = new AppState(can.extend({}, stateObj, newState || {}));

    $('#sandbox').html(testTemplate({
        state: state
    }));

    jasmine.clock().tick(can.fixture.delay);

    component = $('#sandbox seo-generate-page');
    scope = component.data('scope');

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
       
        beforeEach(function(){
            vm = new ViewModel();
        });

        it('it has a default generateFilePath type', function () {  
            expect(typeof vm.attr('generateFilePath')).toBe('string');
        });

        it('it has a default generateFilePath value', function () {  
            expect(vm.attr('generateFilePath')).toBe(envVars.apiUrl() + '/process-publishing-ready-file.json?');
        });

    
        it('it has a default modalOpen type', function () {  
            expect(typeof vm.attr('modalOpen')).toBe('boolean');
        });

        it('it has a default modalOpen value', function () {  
            expect(vm.attr('modalOpen')).toBe(false);
        });

         describe('When the modal is opened', function () {

            beforeEach(function(){
                component.find('#generate-form .modal-trigger').trigger('click');
            });

            it('should open the Modal when the user clicks the toggle modal link', function () {  
                expect(component.find('#formatting-requirements-modal-generate-url').length).toBeGreaterThan(0);
            });

        });

    }); 

    describe('SEO Generate Page', function () {

        it('should Have a Header', function () {
            expect(component.find('h1').text()).toBe('Review Meta Content & Key Paths');
        });

        it('The Generate Form Is Present', function () {
            expect(component.find('#generate-form').length).toBeGreaterThan(0);
        });


        describe('Choose File Button', function () {
            
            it('The Choose File Button should be visible on the page', function () {
                expect(component.find('pui-modal div').length).toBeGreaterThan(0);
            });
 
        });

        describe('Generate File Button', function () {
            
            it('The Generate File Button should be visible on the page', function () {
                expect(component.find('.btn.btn-primary').text().length).toBeGreaterThan(0);
            });

        });


    });

});
