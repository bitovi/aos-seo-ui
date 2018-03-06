var can = require('can');
var _ = require('lodash');

require('can/view/stache/stache');
require('seo-ui/components/user-menu/user-menu');
require('seo-ui/components/fixture-toggle/fixture-toggle');
require('bootstrap/js/dropdown');
require('@apple/pui/components/nav-bar/nav-bar');

var template = require('./header.stache!');
var ViewModel = require('./header.viewmodel');
var saveChangesModal = require('seo-ui/utils/unsaved-changes-dialog');

module.exports = can.Component.extend({
    tag: 'seo-header',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @description Invoked when .check-saved-state-js is clicked
         * @param {Object} $el the clicked jquery element
         * @param {Object} ev the event object
         */
        '.check-saved-state-js click': function ($el, ev) {
            var self = this;
            var isUnsaved = this.viewModel.attr('state.unsaved');
            if (isUnsaved) {
                saveChangesModal($el, ev, function go() {
                    self.viewModel.state.removeAttr('unsaved');
                    $el.trigger('click');
                });
            }
        }
    },

    helpers: {
        /**
         * @function header.activeTab activeTab
         * @description Sets the class for the current active tab.
         * @return {String} The active tab class
         */
        activeTab: function (url) {
            var route = can.route.attr('route');
            var activeTabClass;

            url = url && url.isComputed ? url() : '';

            // Adjustment for home route, which can be either '' or url-list
            if (route !== '' && url === '') {
                url = 'url-list';
            }

            if (route && url) {
                route = route.indexOf('/') ? _.first(route.split('/')) : route;
            }

            if (route === '') {
                activeTabClass = route === url ? 'selected-tab' : '';
            } else {
                activeTabClass = url.indexOf(route) > -1 ? 'selected-tab' : '';
            }

            return activeTabClass;
        },

        /**
         * @function header.userHasAction userHasAction
         * @description Checks  the user permissions
         * @param {String} action action that we are passing to check users permissions
         * @param {Object} options current context
         * @return {String} user permission to access the app
         */
        userHasAction: function (action, options) {
            var user = this.attr('state.user');
            user = can.isFunction(user) ? user() : user;
            return user.hasAction(action) ? options.fn(this) : options.inverse(this);
        }
    }
});
