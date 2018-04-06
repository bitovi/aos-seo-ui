var Component = require('can-component');

require('can-stache');
module.exports = Component.extend({
    tag: 'seo-home',

    events: {
        inserted: function () {
            // Redirects to URL list
            this.viewModel.state.attr('page', 'url-list');
        }
    },

    leakScope: true
});
