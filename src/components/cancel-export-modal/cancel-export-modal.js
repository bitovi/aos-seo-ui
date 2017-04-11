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
 * <seo-cancel-export-modal></seo-cancel-export-modal>
 * ```
 */

var can = require('can');

require('@apple/pui/components/dialog/dialog');

var template = require('./cancel-export-modal.stache!');
var ViewModel = require('./cancel-export-modal.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-cancel-export-modal',
    template: template,
    viewModel: ViewModel
});
