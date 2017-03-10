require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/popover/popover');
require('seo-ui/components/export-urls/export-urls');
require('seo-ui/components/list-page/list-page');

var can = require('can');
var template = require('./url-list.stache!');
var ViewModel = require('./url-list.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-url-list',
    template: template,
    viewModel: ViewModel
});
