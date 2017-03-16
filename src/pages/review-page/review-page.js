var can = require('can');
var $ = require('jquery');

var envVars = require('seo-ui/utils/environmentVars');
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
            // Add CSRF token ti URL
            vm.attr('reviewFilePath', envVars.apiUrl() + '/process-csv-url.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);

            $('#review-file-form').attr('action', vm.reviewFilePath);
        },

        /**
         * @description Register any keyup event within the textarea.
         */
        '#urlTexts keyup': function () {
            var $downloadBtn = $('#doDownload');
            var $urlTextsValue = $('#urlTexts').val();

            if (!$urlTextsValue) {
                $downloadBtn.attr('disabled', 'disabled');
            } else {
                $downloadBtn.prop('disabled', false);
            }
        },

        /**
         * @description Register click events that happen on the Clear Field button.
         */
        '#clearTextareaField click': function () {
            var $downloadBtn = $('#doDownload');
            var $urlTextsValue = $('#urlTexts').val();

            if (!$urlTextsValue) {
                $downloadBtn.attr('disabled', 'disabled');
            } else {
                $downloadBtn.prop('disabled', false);
            }
        }
    }
});
