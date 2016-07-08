var can = require('can'),
  ViewModel = require('./header.viewmodel.js');

require('can/view/stache/stache');
require('components/user-menu/user-menu.js');
require('bootstrap/js/dropdown');

var template = require('./header.stache');

module.exports = can.Component.extend({
  tag: 'app-header',
  template: template,
  viewModel: ViewModel,
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

      // Adjustment for home route, which can be either '' or URLs
      if (route !== '' && url === '') {
        url = 'URLs';
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
