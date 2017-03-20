var can = require('can');
var $ = require('jquery');

var envVars = require('seo-ui/utils/environmentVars');
var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

require('can/map/define/define');
require('can/view/stache/stache');
require('pui/components/file-downloader/file-downloader');
require('pui/components/modal/modal');
require('pui/components/panel/panel');
require('pui/components/tabs/tabs');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel,
    events: {
        /**
         * @function api.pages.review-page.events.inserted
         * @description Event listener that is called when the component is inserted on the page.
         */
        'inserted': function () {
            var vm = this.viewModel;
            // Add CSRF token to URL
            vm.attr('reviewFilePath', envVars.apiUrl() + '/process-csv-url.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);
        },

        /**
         * @function api.pages.review-page.events.'#url-texts keyup'
         * @description Register any keyup event within the textarea.
         */
        '#url-texts keyup': function () {
            var $downloadBtn = $('#do-download');
            var $urlTextsValue = $('#url-texts').val();

            if (!$urlTextsValue) {
                $downloadBtn.prop('disabled', true);
            } else {
                $downloadBtn.prop('disabled', false);
            }
        },

        /**
         * @function api.pages.review-page.events.'#clear-textarea click'
         * @description Register click events that happen on the Clear Field button.
         */
        '#clear-textarea click': function () {
            var $downloadBtn = $('#do-download');
            $downloadBtn.prop('disabled', true);
        }
    }
});
