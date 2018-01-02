require('can/map/define/define');
require('can/view/stache/stache');
require('@apple/pui/components/popover/popover');

var can = require('can');
var template = require('./edit-title-description-list.stache!');
var ViewModel = require('./edit-title-description-list.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-edit-title-description-list',
    template: template,
    viewModel: ViewModel
});
