var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

require('can/map/define/define');

var ViewModel = can.Map.extend({
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
     * @function header.viewModel.link
     * @description Generates a URL according to the passed in variables.
     * @return {String} it returns a URL string.
     */
    link: function (page) {
        var url = page || '';

        return envVars.rootApp() + '/' + url;
    }
});

module.exports = ViewModel;
