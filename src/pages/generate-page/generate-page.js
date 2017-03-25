var can = require('can');

var template = require('./generate-page.stache!');
var ViewModel = require('./generate-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('@apple/pui/components/modal/modal');
require('@apple/pui/components/panel/panel');

module.exports = can.Component.extend({
    tag: 'seo-generate-page',
    template: template,
    viewModel: ViewModel
});
