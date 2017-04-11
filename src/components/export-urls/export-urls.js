require('can/map/define/define');
require('@apple/pui/components/action-bar-menu/action-bar-menu');
require('@apple/pui/components/alert/alert');
require('@apple/pui/components/file-downloader/file-downloader');
require('@apple/pui/components/panel/panel');

var can = require('can');
var ViewModel = require('./export-urls.viewmodel');
var template = require('./export-urls.stache!');

module.exports = can.Component.extend({
    tag: 'seo-export-urls',
    template: template,
    viewModel: ViewModel
});
