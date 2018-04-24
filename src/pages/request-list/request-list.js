/**
 * @module  {can.Component} request-list  Request-list
 * @parent pages
 *
 * @description request list page displays all thre created request.
 */

require('can-map-define');
require('can-stache');
require('bootstrap/js/collapse');

require('@apple/pui/dist/cjs/components/grid-list/grid-list');
require('@apple/pui/dist/cjs/components/grid-search/grid-search');
require('@apple/pui/dist/cjs/components/grid-multi-search/grid-multi-search');
require('@apple/pui/dist/cjs/components/pagination/pagination');

var Component = require('can-component');
var template = require('./request-list.stache!');
var ViewModel = require('./request-list.viewmodel');

module.exports = Component.extend({
    tag: 'seo-request-list',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @function pui-grid-list .item click
         * @description Handles click event of an item in the Grid List.
         * @param {jQuery object} $row The table row receiving the click event
         */
        'pui-grid-list .item click': function ($row) {
            var appState = this.viewModel.attr('state');
            var itemData = $row.data('item');
            var key = itemData.attr('id');

            appState.setRouteAttrs({
                page: 'request-detail',
                route: 'request-list/:requestPath',
                requestPath: key
            });
        }
    },

    leakScope: true
});
