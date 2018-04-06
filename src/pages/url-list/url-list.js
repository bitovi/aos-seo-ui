require('can-map-define');
require('can-stache');
require('@apple/pui/dist/cjs/components/popover/popover');
require('seo-ui/components/export-urls/export-urls');
require('seo-ui/components/list-page/list-page');

var Component = require('can-component');

var template = require('./url-list.stache!');
var ViewModel = require('./url-list.viewmodel');

module.exports = Component.extend({
    tag: 'seo-url-list',
    view: template,
    ViewModel: ViewModel,
    leakScope: true
});
