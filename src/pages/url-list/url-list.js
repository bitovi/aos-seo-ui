var can = require('can');

require('can/map/define/define');
require('can/view/stache/stache');

require('components/list-page/list-page.js');

var ViewModel = require('./url-list.viewmodel.js');
var template = require('./url-list.stache');

require('models/url/url.js');

module.exports = can.Component.extend({
    tag: 'seo-url-list',
    template: template,
    viewModel: ViewModel
});
