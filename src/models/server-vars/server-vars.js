var can = require('can');
var User = require('seo-ui/models/user/user');

require('can/map/define/define');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {string} server-vars.clientVersion clientVersion
         * @description The application version as defined by the UI's package.json.
         */
        clientVersion: {
            type: 'string'
        },
        /**
         * @property {string} server-vars.serverVersion serverVersion
         * @description The application version received from the server, the API version.
         */
        serverVersion: {
            type: 'string'
        },
        /**
         * @property {User} server-vars.user user
         * @description The user of the system, and their authorizations.
         */
        user: {
            Type: User
        },
        /**
         * @property {function(): ServerVars} server-vars.readOnlyUser readOnlyUser
         * @description Changes the current user to a user with read-only rights.
         */
        readOnlyUser: {
            get: function () {
                this.attr('user.roles', ['ROLE_USER_READONLY']);
                return this;
            }
        },
        /**
         * @property {function(): ServerVars} server-vars.writeUser writeUser
         * @description Changes the current user to a user with deployment and approval
         * rights.
         */
        writeUser: {
            get: function () {
                this.attr('user.roles', [
                    'ROLE_USER',
                    'ROLE_ADMIN'
                ]);
                return this;
            }
        }
    }
});
