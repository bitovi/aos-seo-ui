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
         * @function api.pages.review-page.events.'.btn-primary click'
         * @description Callback function invoked when any '.btn-primary' is clicked.
         * @param $el The clicked element.
         * @param evt The event object.
         */
        '.btn-primary click': function ($el, evt) {
            var def = GenerateExportIdModel.findOne();
            var vm = this.viewModel;
            var self = this;
            var targetId = evt.target.id;

            def.then(function (resp) {
                // This is necessary, because the value of the exportId is not getting populated on the second tab
                self.element.find('#export-id').val(resp.id);

                vm.attr('exportId', resp.id);

                if (targetId === 'review-file-from-input-btn') {
                    vm.buildParams();
                    // Start the export
                    vm.attr('doDownloadExport', true);
                    // Reset the variable to enable doing the export again
                    vm.attr('doDownloadExport', false);
                } else if (targetId === 'review-file-btn') {
                    // Submit the form
                    self.element.find('#review-file-form').submit();
                }

                vm.getProgress();
            });
        }
    }
});
