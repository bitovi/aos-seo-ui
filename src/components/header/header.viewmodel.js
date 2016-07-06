var can = require('can');
require('can/map/define/define');

var ViewModel = can.Map.extend({
    define: {
        homeUrl: {
            value: '',
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
        return '{@ROUTE_ROOT}/' + url;
    }

});

module.exports = ViewModel;
