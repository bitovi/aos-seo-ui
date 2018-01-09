require('can/map/define/define');
require('can/view/stache/stache');
require('@apple/pui/components/popover/popover');
require('@apple/pui/components/grid-list/grid-list');

var can = require('can');
var template = require('./edit-metadata-list.stache!');
var ViewModel = require('./edit-metadata-list.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-edit-metadata-list',
    template: template,
    viewModel: ViewModel
});