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
                user: new User({
                    "roles": ["ROLE_USER", "ROLE_USER_READONLY"]
                })
            });
            var sandBox = $('#sandbox');
            sandBox.html(frag);

            component = sandBox.find('seo-header');

        });

        it('initial render', function () {
            expect(component).toExist();
        });
    });
});
