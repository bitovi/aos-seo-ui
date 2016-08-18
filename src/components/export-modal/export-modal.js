/**
 *
 * @description  This component is used to cancel or continue export.
 * @demo ../../demos/schema/demo.html
 *
 * @body
 *
 * # Use
 *
 * ```
 * <seo-export-modal></seo-export-modal>
 * ```
 */

var can = require('can');

require('pui/components/dialog/dialog');

var template = require('./export-modal.stache!');
var ViewModel = require('./export-modal.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-export-modal',
    template: template,
    viewModel: ViewModel,
    events: {

        '.continue-export click': function () {

        },
        '#{dialogName} hidden.bs.modal': function () {
            this.viewModel.attr('isVisible', false);
        },
        /**
         * Close the modal overlay in case of success/failure of exporting the urls.
         */
        '{viewModel} closeDialog': function () {
            var dialogName = this.viewModel.attr('dialogName');
            this.element.find('pui-dialog #' + dialogName).modal('hide');
        }
    }
});
