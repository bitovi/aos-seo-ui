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
    }

});

module.exports = ViewModel;
