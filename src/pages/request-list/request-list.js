/**
 * @module  {can.Component} request-list  Request-list
 * @parent pages
 *
 * @description request list page displays all thre created request.
 */

require('can/map/define/define');
require('can/view/stache/stache');
require('bootstrap/js/collapse');

require('@apple/pui/components/grid-list/grid-list');
require('@apple/pui/components/grid-search/grid-search');
require('@apple/pui/components/grid-multi-search/grid-multi-search');
require('@apple/pui/components/pagination/pagination');

var can = require('can');
var template = require('./request-list.stache!');
var ViewModel = require('./request-list.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-request-list',
    template: template,
    viewModel: ViewModel,
});