var can = require('can');
var ViewModel = require('./url-list.viewmodel');
var template = require('./url-list.stache!');

require('can/map/define/define');
require('can/view/stache/stache');
require('seo-ui/components/export-urls/export-urls');
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
                    sort: 'partNumber'
                });
            }
        }
    }
});
