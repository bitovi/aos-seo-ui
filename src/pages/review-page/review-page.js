var can = require('can');

var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/file-downloader/file-downloader');
require('pui/components/modal/modal');
require('pui/components/panel/panel');
require('pui/components/tabs/tabs');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel
});
