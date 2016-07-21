/**
 * @parent components.seo-user-menu
 * @tag documentation
 * @module {constructor} Seo-User-Menu/ViewModel Seo-User-Menu
 */
var can = require('can');
require('can/map/define/define');

var ViewModel = can.Map.extend({
    define: {
        isLocalInstance: {
            type: 'boolean'
        },
        fixtures: {
            get: function () {
                return window.seo.configure.attr('fixtures') ? 'ON' : 'OFF';
            }
        },
        /**
         * @property {String} user-menu.userInitials userInitials
         * Gets the initials from the user data object.
         *
         */
        userInitials: {
            get: function () {
                var userData = window.seo;
                return (userData && userData.user && userData.user.initials) ? userData.user.initials : '??';
            }
        }
    },
    toggleFixtures: function () {
        window.seo.configure.attr('toggleFixtures');
    }
});

module.exports = ViewModel;
