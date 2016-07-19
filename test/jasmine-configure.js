var $ = require('jquery');
var _ = require('lodash');
var can = require('can');

require('can/util/fixture/fixture');

var defaults = {
    fixtureDelay: 0,
    persistentSandbox: false,
    useClock: true,
    useFixtures: true,
    useSandbox: true
};

var realDebounce = _.debounce;
var fakeDebounce = function (fn, delay) {
    var timeoutId;

    return function () {
        var args = arguments;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(function () {
            fn.apply(this, args);
        }, delay);
    };
};

module.exports = function (options) {
    var config = can.extend({}, defaults, options);
    var oldFixtureDelay = can.fixture.delay;
    var oldFixtureValue = can.fixture.on;
    var oldSupportTransition = $.support.transition;

    can.fixture.on = config.useFixtures;
    can.fixture.delay = config.fixtureDelay;

    if (config.useClock) {
        // jQuery animations do not work with the mock timer
        // https://github.com/jasmine/jasmine/issues/184
        $.fx.off = true;
        $.support.transition = undefined;
        jasmine.clock().install();
        _.debounce = fakeDebounce;
    }

    if (config.useSandbox) {
        if (config.persistentSandbox && $('#sandbox').length === 0) {
            $('body').append('<div id="persistent-jasmine-fixtures"><div id="sandbox"></div></div>');
        } else {
            setFixtures(sandbox());

            // Jasmine does not properly clear the sandbox. Many of the Can events
            // are tied to jQuery methods. In our case, some elements stick around
            // because Jasmine does not use jQuery methods to clear the sandbox.
            jasmine.Fixtures.prototype.cleanUp = function() {
                $('#' + this.containerId).remove();
            };
        }
    }

    //cleanup function
    return function (force) {
        can.fixture.on = oldFixtureValue;
        can.fixture.delay = oldFixtureDelay;

        //Only clean up the persistent sandbox when force is true
        if (config.useSandbox && config.persistentSandbox && force) {
            $('#persistent-jasmine-fixtures').remove();
        }

        // Tests run inside of a loop which causes this line to never execute:
        // https://github.com/canjs/canjs/blob/470bf9e45d5e9054e7b825a25e5111051a1de411/compute/proto_compute.js#L398
        // Clearing the `computes` array after each tests helps reduce memory
        // usage but the `unbindComputes` function is a private function.
        // Apply the function to `window` here:
        // https://github.com/canjs/canjs/blob/470bf9e45d5e9054e7b825a25e5111051a1de411/compute/proto_compute.js#L392
        // (make sure you use the dist/cjs version), doing this will keep this
        // array under control since it can get into the tens of thousands.
        if (window.unbindComputes) {
            window.unbindComputes();
        }

        can.$('.modal-backdrop').remove();

        if (config.useClock) {
            $.fx.on = true;
            $.support.transition = oldSupportTransition;
            jasmine.clock().uninstall();
            _.debounce = realDebounce;
        }
    };
};
