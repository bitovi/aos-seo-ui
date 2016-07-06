/**
 * @parent components.seo-user-menu
 * @tag documentation
 * @module {constructor} Seo-User-Menu/ViewModel Seo-User-Menu
 */
var $ = require('jquery');
var can = require('can');
require('can/map/define/define');

var ViewModel = can.Map.extend({
    define: {
        /**
         * @property {String} user-menu.userInitials userInitials
         * Gets the initials from the user data object.
         *
         */
        userInitials: {
            get:function(){
                var userData = window.userData;
				return (userData && userData.user && userData.user.initials) ? userData.user.initials : '??';
            }
        }
    }
});

module.exports = ViewModel;
