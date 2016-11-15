require('can/map/define/define');
require('pui/components/action-bar-menu/action-bar-menu');

var can = require('can');
var ViewModel = require('./export-urls.viewmodel');
var template = require('./export-urls.stache!');
require('pui/components/file-downloader/file-downloader');
require('pui/components/panel/panel');
require('pui/components/alert/alert');

module.exports = can.Component.extend({
    tag: 'seo-export-urls',
    template: template,
    viewModel: ViewModel
});
