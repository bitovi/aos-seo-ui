var can = require('can');
var ViewModel = require('./fixture-toggle.viewmodel');

require('can/view/stache/stache');

var template = require('./fixture-toggle.stache!');

module.exports = can.Component.extend({
    tag: 'seo-fixture-toggle',
    template: template,
    viewModel: ViewModel
});
