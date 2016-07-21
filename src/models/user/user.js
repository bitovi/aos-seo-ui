var can = require('can');

/**
 * @module {function} models/user User
 * @parent models
 *
 * Provides information about a user and their access rights
 *
 */
module.exports = can.Construct.extend({
    init: function (seo) {
        can.extend(this, seo);
    },
    _hasRole: function (roleList) {
        return this.roles.some(function (element) {
            return roleList.indexOf(element) > -1;
        });
    },
    isNoAccess: function () {
        return this.roles.length === 0;
    },
    isReadOnly: function () {
        return this.roles.indexOf('ROLE_USER_READONLY') > -1;
    }
});
