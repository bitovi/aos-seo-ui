var $ = require('jquery'),
    can = require('can');

require('can/map/define/define');

var ViewModel = can.Map.extend({
    define: {
		/* Define here your properties for the component !! */
    },

    /**
     * @function navigateToPage
     * Navigates to a page
     * @param {string} versionName
     */
    navigateToPage: function(page) {
        var appState = this.attr('state');
        appState.attr({
            page: page
        });
    }

});

module.exports = ViewModel;