var can = require('can'),
  ViewModel = require('./viewmodel.js');

require('can/view/stache/stache');
require('components/user-menu/user-menu.js');

var template = require('./header.stache');

module.exports = can.Component.extend({
  tag: 'app-header',
  template: template,
  scope: ViewModel,
  events: {
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
     * @function header.viewModel.activeTab activeTab
     * @description Sets the class for the current active tab.
     * @return {String} The active tab class
     */
    activeTab: function (url) {
      var route = can.route.attr('route');
      var activeTabClass;

      url = url && url.isComputed ? url() : '';

      // Adjustment for home route, which can be either '' or revisions
      if (route !== '' && url === '') {
        url = 'revisions';
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
    }
  }
});
