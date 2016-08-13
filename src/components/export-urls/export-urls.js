require('can/map/define/define');
require('pui/components/action-bar-menu/action-bar-menu');
require('pui/components/action-bar-menu/action-bar-dropdown/');
require('pui/components/action-bar-menu/action-bar-item/');

var can = require('can');
var ViewModel = require('./export-urls.viewmodel');
var template = require('./export-urls.stache!');

module.exports = can.Component.extend({
    tag: 'seo-export-urls',
    template: template,
    viewModel: ViewModel
});
