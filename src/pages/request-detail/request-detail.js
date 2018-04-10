/**
 * @module  {can.Component} request-detail  Request-Detail
 * @parent pages
 *
 * @description request detail page displays all the detail of the request and radar.
 */
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
        'init': function () {        	
        	this.viewModel.getRequestDetails();
        }
    }
});