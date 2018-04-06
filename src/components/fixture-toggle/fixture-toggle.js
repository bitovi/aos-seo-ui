var Component = require('can-component');
var ViewModel = require('./fixture-toggle.viewmodel');

require('can-stache');

var template = require('./fixture-toggle.stache!');

module.exports = Component.extend({
    tag: 'seo-fixture-toggle',
    view: template,
    ViewModel: ViewModel,
    leakScope: true
});
