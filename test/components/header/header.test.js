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
            persistentSandbox: true,
            useClock: false
        });
    });

    afterEach(function () {
        jasmineConfigClean(true);
    });

    describe('Component', function () {

        beforeEach(function () {

            setFixtures(sandbox());
            var frag = testTemplate({
                user: new User({
                    "roles": ["ROLE_USER", "ROLE_USER_READONLY"]
                })
            });
            var sandBox = $('#sandbox');
            sandBox.html(frag);

            component = $('#sandbox seo-header');

        });

        it('initial render', function () {
            expect(component).toExist();
            expect(component.find('.global-top-nav')).toExist();
            expect(component.find('.global-secondary-nav')).toExist();
        });

        it('Renders users Readonly mode', function () {
            var frag = testTemplate({
                user: new User({
                    "roles": ["ROLE_USER_READONLY"]
                })
            });
            $('#sandbox').html(frag);

            component = $('#sandbox seo-header');
            debugger;
            scope = component.data('scope');
            expect(component.find('.read-only-label')).toExist();
        });
    });
});
