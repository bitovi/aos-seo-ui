var can = require('can');

var ViewModel = require('./review-page.viewmodel');
var template = require('./review-page.stache!');

require('can/map/define/define');
require('can/view/stache/stache');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel
});
