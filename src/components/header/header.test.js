var $ = require('jquery');
var canViewModel = require('can-view-model');

var $component;
var $sandBox;
var jasmineConfig = require('test/jasmine-configure');
var jasmineConfigClean;
var testTemplate = require('./header.test.stache');
var User = require('seo-ui/models/user/user');
var vm;

require('./header');
require('can-fixture');

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
            // these are provided by `jasmine-jquery`
            window.setFixtures(window.sandbox());

            var frag = testTemplate({
                state: {
                    user: new User({
                        roles: ['ROLE_USER', 'ROLE_USER_READONLY']
                    })
                }
            });

            $sandBox = $('#sandbox');
            $sandBox.html(frag);

            $component = $('#sandbox seo-header');
            vm = canViewModel($component);
        });

        it('exists', function () {
            expect($component).toExist();
        });

        describe('global-top-nav', function () {
            it('exists', function () {
                expect($component.find('.global-top-nav')).toExist();
            });
        });

        describe('version number', function () {
            beforeEach(function () {
                vm.attr('version', '1.0');
            });

            it('matches', function () {
                expect($component.find('.version').text().trim()).toEqual(vm.attr('version'));
            });
        });

        describe('users Readonly mode', function () {
            beforeEach(function () {
                var frag = testTemplate({
                    state: {
                        user: new User({
                            roles: ['ROLE_USER_READONLY']
                        })
                    }
                });
                $sandBox.html(frag);
                $component = $('#sandbox seo-header');
            });

            it('renders', function () {
                expect($component.find('.read-only-label')).toExist();
            });
        });

        describe('dropdown-menu', function () {
            beforeEach(function () {
                $('#sandbox seo-header seo-user-menu .dropdown [data-toggle="dropdown"]').click();
            });

            it('is shown', function () {
                expect($('#sandbox seo-header seo-user-menu .dropdown-menu li').length).toBe(1);
            });

            it('contains text Logout', function () {
                expect($('#sandbox seo-header seo-user-menu .dropdown-menu li').text()).toContain('Logout');
            });
        });
    });
});
