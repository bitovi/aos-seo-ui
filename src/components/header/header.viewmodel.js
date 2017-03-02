var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
require('can/map/define/define');

var ViewModel = can.Map.extend({
    define: {
        homeUrl: {
            value: 'urls',
            type: 'string'
        },
        requestUrl:{
            value: 'request',
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
     * @function header.viewmodel.appInfo
     * @description This will return the super global "seo" that is defined on the window object on the page
     * @return {Object} The appInfo. See the index.html for details about what's there
     */
    appInfo: function () {
        var seo = window.seo;

        return seo !== undefined ? seo : {};
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
     * @function header.viewmodel.logoutUrl
     * @description The URL that we need to use to logout of the system
     * @return {String} The logout URL
     */
    logoutUrl: function () {
        return envVars.rootApp() + '/logout';
    }

});

module.exports = ViewModel;
