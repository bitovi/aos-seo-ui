var can = require('can');

require('can/map/define/define');
require('can/view/stache/stache');

require('seo-ui/components/list-page/list-page');

var ViewModel = require('./url-list.viewmodel');
var template = require('./url-list.stache!');

require('seo-ui/models/url/url');

module.exports = can.Component.extend({
    tag: 'seo-url-list',
    template: template,
    viewModel: ViewModel
});
