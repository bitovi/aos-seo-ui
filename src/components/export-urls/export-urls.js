var can = require('can'),
  ViewModel = require('./export-urls.viewmodel.js');

require('can/view/stache/stache');
require('bootstrap/js/dropdown');

var template = require('./export-urls.stache');

module.exports = can.Component.extend({
  tag: 'seo-export-urls',
  template: template,
  viewModel: ViewModel
});
