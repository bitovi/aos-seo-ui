var can = require('can');

var ViewModel = require('./generate-page.viewmodel');
var template = require('./generate-page.stache!');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/file-upload/file-upload');
require('pui/components/modal/modal');
require('bootstrap/js/modal');

module.exports = can.Component.extend({
    tag: 'seo-generate-page',
    template: template,
    viewModel: ViewModel
});
