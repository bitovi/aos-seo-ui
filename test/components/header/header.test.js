var $ = require('jquery');
var can = require('can');

var component;
var scope;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./header.test.stache');
var User = require('seo-ui/models/user/user');
var ViewModel = require('seo-ui/components/header/header.viewmodel');
var vm;

require('seo-ui/components/header/header');
require('can/util/fixture/fixture');

describe('Header', function () {
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

            setFixtures(sandbox());
            var frag = testTemplate({
                state: {
                    user: new User({
                        "roles": ["ROLE_USER", "ROLE_USER_READONLY"]
                    })
                }
            });
            var sandBox = $('#sandbox');
            sandBox.html(frag);

            component = $('#sandbox seo-header');

        });

        it('initial render', function () {
            expect(component).toExist();
            var vm = $('#sandbox seo-header').viewModel();
            expect(component.find('.global-top-nav')).toExist();
            expect(component.find('.global-secondary-nav')).toExist();
            vm.attr('version', '1.0');
            expect(component.find('.version').text().trim()).toEqual(vm.attr('version'));
        });

        it('Renders users Readonly mode', function () {
            var frag = testTemplate({
                state: {
                    user: new User({
                        "roles": ["ROLE_USER_READONLY"]
                    })
                }
            });
            $('#sandbox').html(frag);

            component = $('#sandbox seo-header');
            expect(component.find('.read-only-label')).toExist();
        });

        it('shows menu', function () {

            $('#sandbox seo-header seo-user-menu .dropdown [data-toggle="dropdown"]').click();

            expect($('#sandbox seo-header seo-user-menu .dropdown-menu li').length).toBe(1);
            expect($('#sandbox seo-header seo-user-menu .dropdown-menu li').text()).toContain('Logout');

        });

    });
});
