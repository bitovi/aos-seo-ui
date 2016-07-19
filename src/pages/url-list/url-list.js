var can = require('can');
var ViewModel = require('./url-list.viewmodel.js');
var template = require('./url-list.stache');

require('can/map/define/define');
require('can/view/stache/stache');
require('components/list-page/list-page.js');
require('pui/components/action-bar/action-bar');
require('models/url/url.js');

module.exports = can.Component.extend({
    tag: 'seo-url-list',
    template: template,
    viewModel: ViewModel
});
