require('can-map-define');
require('@apple/pui/dist/cjs/components/action-bar-menu/action-bar-menu');
require('@apple/pui/dist/cjs/components/alert/alert');
require('@apple/pui/dist/cjs/components/file-downloader/file-downloader');
require('@apple/pui/dist/cjs/components/panel/panel');

var Component = require('can-component');

var ViewModel = require('./export-urls.viewmodel');
var template = require('./export-urls.stache!');

module.exports = Component.extend({
    tag: 'seo-export-urls',
    view: template,
    ViewModel: ViewModel,
    leakScope: true
});
