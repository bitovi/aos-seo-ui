var CanMap = require('can-map');
/**
 * @parent components.seo-user-menu
 * @tag documentation
 * @module {constructor} Seo-User-Menu/ViewModel Seo-User-Menu
 */
require('can-map-define');

var ViewModel = CanMap.extend({
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
