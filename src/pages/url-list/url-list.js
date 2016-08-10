var can = require('can');
var ViewModel = require('./url-list.viewmodel');
var template = require('./url-list.stache!');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/action-bar-menu/action-bar-menu');
require('seo-ui/components/list-page/list-page');
require('seo-ui/models/url/url');

module.exports = can.Component.extend({
    tag: 'seo-url-list',
    template: template,
    viewModel: ViewModel,
    events: {
        'inserted': function () {
            var state = this.viewModel.attr('state');

            if (state) {
                state.attr({
                    order: 'asc',
                    sort: 'partNumber'
                });
            }
        }
    }
});
