/* eslint camelcase: 0 */

var can = require('can');
require('can/map/define/');

var roleLevels = {
    no_access: -1,
    role_read_only: 0,
    role_user: 1,
    role_admin: 100
};

/**
 * @module {can.Model} user User
 * @parent api.models
 *
 * @description
 * A can.Model that represents a user.
 *
 * Provides access to the user's roles, and what actions they are authorized to
 * perform in the system.
 * Each role is assigned a numeric value. Access levels are assumed to be
 * inclusive of the permissions underneath them---i.e., a level 2 can do
 * everything a level 1 can do. Each role is assigned a numeric value, and the
 * user is assigned their highest access level number. For example, If a user
 * has ACL values of 0, 1, and 100, their effective system access level will be
 * 100.
 */
module.exports = can.Map.extend({
    define: {
        actions: {
            Type: can.Map.List
        },
        roles: {
            set: function (newRoles) {
                var highest = -1;
                if (newRoles.length > 1) {
                    newRoles.forEach(function (role) {
                        var accessLevel = roleLevels[role.toLowerCase()];
                        highest = accessLevel >= highest ? accessLevel : highest;
                    });
                } else {
                    highest = roleLevels[newRoles[0].toLowerCase()];
                }
                this.attr('accessLevel', highest);
                return newRoles;
            }
        }
    },
    initUser: function initUser(userObj) {
        can.extend(this, userObj);
        this.attr('roles', this.roles);
    },
    // The guts of this function will soon be replaced when the new ACL actions
    // feature is in place.
    // For right now, it is a wrapper to help with the user of the hasAction
    // helper in templates
    hasAction: function (action) {
        switch (action) {
            case 'delete':
                return this.canDelete();
            case 'edit':
                return this.canEdit();
            default:
                return false;
        }
    },
    isNoAccess: function () {
        return this.attr('accessLevel') === roleLevels.no_access;
    },
    isReadOnly: function () {
        return this.attr('accessLevel') >= roleLevels.role_read_only;
    },
    canEdit: function () {
        return this.attr('accessLevel') >= roleLevels.role_user;
    },
    canDelete: function () {
        return this.attr('accessLevel') >= roleLevels.role_admin;
    }
});
