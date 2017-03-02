var can = require('can');

var ViewModel = require('./review.viewmodel');
var template = require('./review.stache!');

require('can/map/define/define');
require('can/view/stache/stache');
require('seo-ui/components/review-page/review-page');

module.exports = can.Component.extend({
    tag: 'seo-review',
    template: template,
    viewModel: ViewModel
});
