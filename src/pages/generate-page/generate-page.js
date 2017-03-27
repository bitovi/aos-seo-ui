var can = require('can');

var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var template = require('./generate-page.stache!');
var ViewModel = require('./generate-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/alert/alert');
require('pui/components/modal/modal');
require('pui/components/panel/panel');

module.exports = can.Component.extend({
    tag: 'seo-generate-page',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @function api.pages.generate-page.events.'#generate-file-btn click'
         * @description Callback function invoked when '#generate-file-btn' is clicked.
         */
        '#generate-file-btn click': function () {
            var def = GenerateExportIdModel.findOne();
            var vm = this.viewModel;
            var self = this;

            def.then(function (resp) {
                vm.attr('exportId', resp.id);
                vm.attr('params.exportId', resp.id);

                // Submit the form
                self.element.find('#generate-form').submit();

                vm.getProgress();
            });
        }
    }
});
