var can = require('can');

require('can/view/stache/stache');

module.exports = can.Component.extend({
    tag: 'seo-home',
    events: {
        'inserted': function () {
            // Redirects to URL list
            this.viewModel.state.attr('page', 'url-list');
        }
    }
});
