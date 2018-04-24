var Component = require('can-component');
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

require('@apple/pui/dist/cjs/components/dialog/dialog');

var template = require('./cancel-export-modal.stache!');
var ViewModel = require('./cancel-export-modal.viewmodel');

module.exports = Component.extend({
    tag: 'seo-cancel-export-modal',
    view: template,
    ViewModel: ViewModel,
    leakScope: true
});
