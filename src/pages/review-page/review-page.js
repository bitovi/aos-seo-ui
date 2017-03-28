var can = require('can');

var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/alert/alert');
require('pui/components/file-downloader/file-downloader');
require('pui/components/modal/modal');
require('pui/components/panel/panel');
require('pui/components/tabs/tabs');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @function api.pages.review-page.events.'#review-file-btn click'
         * @description Callback function invoked when '#review-file-btn' is clicked.
         */
        '#review-file-btn click': function () {
            var def = GenerateExportIdModel.findOne();
            var vm = this.viewModel;
            var self = this;

            def.then(function (resp) {
            	// This is necessary, because the value of the exportId is not getting populated otherwise
            	self.element.find('#export-id').val(resp.id);

                vm.attr('exportId', resp.id);

                // Submit the form
                self.element.find('#review-file-form').submit();

                vm.getProgress();
            });
        }
    }
});
