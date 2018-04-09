require('can/map/define/define');
require('can/view/stache/stache');
require('@apple/pui/components/grid-list/grid-list');

var can = require('can');
var template = require('./request-detail.stache!');
var ViewModel = require('./request-detail.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-request-detail',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @description Invoked when the component is initialized.
         */
        init: function () {
        	var appState = this.viewModel.attr('state');
        	var vm = this.viewModel;
        	var requestPath = appState.attr('requestPath');
        	vm.getRequestDetails(requestPath);
        }
    }
});