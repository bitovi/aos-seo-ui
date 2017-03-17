require('can/map/define/define');

var can = require('can');

var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Map.extend({
    define: {

        /**
         * @property {String} generate-page.viewModel.generateFilePath generateFilePath
         * @description The URL/End-point of the service we need to invoke for exporing/download
         */
        generateFilePath: {
            value: envVars.apiUrl() + '/process-publishing-ready-file.json?',
            type: 'string'
        },

        /**
         * @property {boolean} generate-page.viewModel.modalOpen modalOpen
         * @description shows if the modal window is open or not
         */
        modalOpen: {
            type: 'boolean',
            value: false
        }
    },

    /**
     * @function generate-page.viewmodel.toggleModal toggleModal
     * @description Function that toggles the Modal when Close button is clicked.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
