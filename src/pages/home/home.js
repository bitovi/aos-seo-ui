var can = require('can'),
    $ = require('jquery');

require('can/view/stache/stache');

var template = require('./home.stache'),
    ViewModel = require('./home.viewmodel.js');

can.Component.extend({
    tag: 'seo-home',
    template: template,
    scope: ViewModel,
    events: {
		/* Add here your custom events for the home page !!! */
    }
});

module.exports = ViewModel;
