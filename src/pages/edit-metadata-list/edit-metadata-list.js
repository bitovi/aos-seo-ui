require('can-map-define');
require('can-stache');
require('@apple/pui/dist/cjs/components/tooltip/tooltip');
require('@apple/pui/dist/cjs/components/grid-list/grid-list');
require('@apple/pui/dist/cjs/components/modal/modal');
require('@apple/pui/dist/cjs/components/date-picker/date-picker');

var Component = require('can-component');

var template = require('./edit-metadata-list.stache!');
var ViewModel = require('./edit-metadata-list.viewmodel');

module.exports = Component.extend({
    tag: 'seo-edit-metadata-list',
    view: template,
    ViewModel: ViewModel,

    events: {

        /**
         * @description Handles close click event and clear all selected item.
         */
        'pui-modal-header .modal-header .close click': function () {
            var vm = this.viewModel;
            vm.resetDefaults();
        }
    },

    leakScope: true
});
