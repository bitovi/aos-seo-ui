require('can/map/define/define');

var can = require('can');
var $ = require('jquery');

module.exports = can.Map.extend({
    define: {
    	/**
         * @property {String} review-page.viewModel.startTab startTab
         * @description the tab show when the page loads with pui-tabs component
         */
    	startTab: {
			type: 'string',
    		value: 'Enter URLs'
    	},

    	/**
         * @property {Array<Object>} review-page.viewModel.tabsList tabsList
         * @description list of tabs to show by the pui-tabs componenet
         */
    	tabsList: {
    		value: [
	    		{
	    			name: 'Enter URLs'
	    		},
				{
	    			name: 'Upload File'
	    		}
	    	]
	    }
    }
});
