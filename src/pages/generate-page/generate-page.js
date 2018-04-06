var Component = require('can-component');

var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var template = require('./generate-page.stache!');
var ViewModel = require('./generate-page.viewmodel');

require('can-map-define');
require('can-stache');
require('@apple/pui/dist/cjs/components/alert/alert');
require('@apple/pui/dist/cjs/components/modal/modal');
require('@apple/pui/dist/cjs/components/panel/panel');

module.exports = Component.extend({
    tag: 'seo-generate-page',
    view: template,
    ViewModel: ViewModel,

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

                // Submit the form
                self.element.find('#generate-form').submit();

                vm.getProgress();
            });
        }
    },

    leakScope: true
});
