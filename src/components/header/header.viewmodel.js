var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
require('can/map/define/define');

var ViewModel = can.Map.extend({
    define: {
        homeUrl: {
            value: 'urls',
            type: 'string'
        },
        rulesUrl: {
            value: 'rules',
            type: 'string'
        },
        logoutUrl: {
            value: 'logout',
            type: 'string'
        },
        importUrl: {
            value: 'utilities',
            type: 'string'
        },
        reportsUrl: {
            value: 'reports',
            type: 'string'
        }
    },

    /**
     * @function header.viewModel.homeUrl homeUrl
     * @description Generates a URL to the home page.
     * @return {String} The home page URL
     */
    link: function (url) {
        url = url && url.isComputed ? url() : '';
        return envVars.rootApp() + '/' + url;
    },

    /**
     * @function header.viewModel.userHasAction userHasAction
     * @description Checks  the user permissions
     * @param {String} action action that we are passing to check users permissions
     * @param {Object} options current context
     * @return {Object} user permission to access the app
     */
    userHasAction: function (action, options) {
        var user = this.attr('state.user');
        user = can.isFunction(user) ? user() : user;
        return user.hasAction(action) ? options.fn(this) : options.inverse(this);
    }

});

module.exports = ViewModel;
