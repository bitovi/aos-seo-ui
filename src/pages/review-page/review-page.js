var can = require('can');

var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/file-upload/file-upload');
require('pui/components/tabs/tabs');
require('bootstrap/js/modal');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel
});
