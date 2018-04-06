var fixture = require('can-fixture');
var CanMap = require('can-map');
require('can-map-define');

var ViewModel = CanMap.extend({
    define: {
        fixturesOn: {
            value: function () {
                var inStorage = window.sessionStorage.getItem('seo.fixtures');
                var on = true;

                if (inStorage !== null) {
                    on = inStorage !== 'false';
                }
                return on;
            },
            set: function (newVal) {
                window.sessionStorage.setItem('seo.fixtures', newVal);
                fixture.on = newVal;

                if (!this.__inSetup) {
                    window.location.reload();
                }
                return newVal;
            }
        },
        status: {
            get: function () {
                return this.attr('fixturesOn') ? 'On' : 'Off';
            }
        }
    },
    toggle: function () {
        this.attr('fixturesOn', !this.attr('fixturesOn'));
    }
});

module.exports = ViewModel;
