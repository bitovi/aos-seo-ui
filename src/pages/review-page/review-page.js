var can = require('can');

var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('@apple/pui/components/file-upload/file-upload');
require('@apple/pui/components/modal/modal');
require('@apple/pui/components/tabs/tabs');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel
});
