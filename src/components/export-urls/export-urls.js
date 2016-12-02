require('can/map/define/define');
require('pui/components/action-bar-menu/action-bar-menu');
require('pui/components/alert/alert');
require('pui/components/file-downloader/file-downloader');
require('pui/components/panel/panel');

var can = require('can');
var ViewModel = require('./export-urls.viewmodel');
var template = require('./export-urls.stache!');

module.exports = can.Component.extend({
    tag: 'seo-export-urls',
    template: template,
    viewModel: ViewModel
});
