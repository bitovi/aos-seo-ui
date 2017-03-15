var can = require('can');
var $ = require('jquery');

var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/modal/modal');
require('pui/components/panel/panel');
require('pui/components/tabs/tabs');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @function api.components.review-page.events.inserted
         * @description Event listener that is called when the component is inserted on the page.
         */
        'inserted': function () {
            var vm = this.viewModel;
            $('#review-file-form').attr('action', vm.exportFilePath);
        }
    }
});
