var can = require('can'),
    $ = require('jquery');

require('can/view/stache/stache');
require('components/export-urls/export-urls.js');

var template = require('./home.stache'),
    ViewModel = require('./home.viewmodel.js');

can.Component.extend({
    tag: 'app-home',
    template: template,
    scope: ViewModel,
    events: {
		/* Add here your custom events for the home page !!! */
    }
});

module.exports = ViewModel;
