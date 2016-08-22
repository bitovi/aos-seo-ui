var $ = require('jquery'),
    can = require('can'),
    ViewModel = require('seo-ui/components/header/header.viewmodel'),
    testTemplate = require('./header.test.stache'),
    User = require('seo-ui/models/user/user');

require('seo-ui/components/header/header');
require('can/view/stache/');
require('can/map/define/');
require('can/util/fixture/');

var jasmineConfig = require('test/jasmineConfigure');
var jasmineConfigClean;

var vm;
var component;
var scope;

describe('header', function(){

    beforeEach(function () {
        jasmineConfigClean = jasmineConfig();
    });

    afterEach(function () {
        jasmineConfigClean();
    });

    describe('Component', function() {

        var component;

        beforeEach(function(){

            setFixtures(sandbox());
            var frag = testTemplate({
                user: new User({
                  "roles": ["ROLE_USER", "ROLE_USER_READONLY"]
                })
            });
            var sandBox = $('#sandbox');
            sandBox.html( frag );

            component = sandBox.find('seo-header');

        });

        it('initial render', function(){
            expect(component).toExist();
            expect( $('.global-top-nav', component) ).toExist();
            expect( $('.global-secondary-nav', component) ).toExist();
        });
    });
});
