var can = require('can');
var $ = require('jquery');

var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/file-upload/file-upload');
require('pui/components/modal/modal');
require('pui/components/tabs/tabs');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel,
	helpers: {
		/**
         * @description Handles click event of the 
         */
        getURLsFromTextarea: function () {
            var vm = this.viewModel;
            var URLs = $('#urlTexts').val();

            vm.attr('urls', URLs);
            vm.reviewFileInput();
        }
	}
});
