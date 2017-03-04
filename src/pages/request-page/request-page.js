var can = require('can');

var ViewModel = require('./request-page.viewmodel');
var template = require('./request-page.stache!');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/file-upload/file-upload');
require('bootstrap/js/modal');

module.exports = can.Component.extend({
    tag: 'seo-request-page',
    template: template,
    viewModel: ViewModel
});
