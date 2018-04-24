var $ = require('jquery');
var fixture = require('can-fixture');
var assign = require('can-util/js/assign/assign');
var _ = require('lodash');
var llx = require('lolex');
require('steal-jasmine');
require('jasmine-jquery/lib/jasmine-jquery');

require('can-fixture');

var defaults = {
    useFixtures: true,
    fixtureDelay: 0,
    useSandbox: true,
    useClock: true,
    persistentSandbox: false
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

var mockClock;
var oldClock;

module.exports = function (options) {
    var config = assign({}, defaults, options);

    var oldFixtureValue = fixture.on;
    var oldFixtureDelay = fixture.delay;

    var oldSupportTransition = $.support.transition;

    fixture.on = config.useFixtures;
    fixture.delay = config.fixtureDelay;

    if (config.useClock) {
        if (!window.nativeSetTimeout) {
            var setTimeout = window.setTimeout;
            window.nativeSetTimeout = function () {
                setTimeout.apply(window, arguments);
            };
        }

        if (!window.nativeRequestAnimationFrame) {
            var requestAnimationFrame = window.requestAnimationFrame;
            window.nativeRequestAnimationFrame = function () {
                requestAnimationFrame.apply(window, arguments);
            };
        }

        // jQuery animations do not work with the mock timer
        // https://github.com/jasmine/jasmine/issues/184
        $.fx.off = true;
        $.support.transition = undefined;

        mockClock = llx.install();
        oldClock = jasmine.clock;
        jasmine.clock = function () {
            return mockClock;
        };

        _.debounce = fakeDebounce;
    }

    if (config.useSandbox) {
        if (config.persistentSandbox && $('#sandbox').length === 0) {
            $('body').append('<div id="persistent-jasmine-fixtures"><div id="sandbox"></div></div>');
        } else {
            // these are provided by `jasmine-jquery`
            window.setFixtures(window.sandbox());

            // Jasmine does not properly clear the sandbox. Many of the Can events
            // are tied to jQuery methods. In our case, some elements stick around
            // because Jasmine does not use jQuery methods to clear the sandbox.
            jasmine.Fixtures.prototype.cleanUp = function () {
                $('#' + this.containerId).remove();
            };
        }
    }

    // cleanup function
    return function (force) {
        fixture.on = oldFixtureValue;
        fixture.delay = oldFixtureDelay;

        // Only clean up the persistent sandbox when force is true
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

        $('.modal-backdrop').remove();

        if (config.useClock) {
            // Clean up any remaining deferreds or pending setTimeouts so they
            // don't leak into the next specs
            jasmine.clock().runToLast();

            $.fx.on = true;
            $.support.transition = oldSupportTransition;

            mockClock.uninstall();
            jasmine.clock = oldClock;
            // jasmine.clock().uninstall();
            _.debounce = realDebounce;
        }
    };
};
