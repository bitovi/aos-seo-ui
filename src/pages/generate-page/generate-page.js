var can = require('can');
var $ = require('jquery');

var envVars = require('seo-ui/utils/environmentVars');
var template = require('./generate-page.stache!');
var ViewModel = require('./generate-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/modal/modal');
require('pui/components/panel/panel');

module.exports = can.Component.extend({
    tag: 'seo-generate-page',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @function api.components.review-page.events.inserted
         * @description Event listener that is called when the component is inserted on the page.
         */
        'inserted': function () {
            var vm = this.viewModel;
            vm.attr('generateFilePath', envVars.apiUrl() + '/process-publishing-ready-file.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
            $('#generate-form').attr('action', vm.generateFilePath);
        }
    }
});
