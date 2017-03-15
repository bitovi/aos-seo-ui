require('can/map/define/define');

var can = require('can');

var envVars = require('seo-ui/utils/environmentVars');
var ReviewFileFromInputModel = require('seo-ui/models/review-file-input/review-file-input');
var ReviewFileModel = require('seo-ui/models/review-file/review-file');

module.exports = can.Map.extend({
    define: {

        /**
         * @property {String} review-page.viewModel.exportFilePath exportFilePath
         * @description The URL/End-point of the service we need to invoke for exporing/download
         */
        exportFilePath: {
            value: envVars.apiUrl() + '/process-csv-url.json?',
            type: 'string'
        },

        /**
         * @property {boolean} review-page.viewModel.modalOpen modalOpen
         * @description shows if the modal window is open or not
         */
        modalOpen: {
            type: 'boolean',
            value: false
        },

    	/**
		 * @property {String} review-page.viewModel.ReviewFileFromInputModel ReviewFileFromInputModel
		 * @description The model used to generate and retrieve a file based on input.
		 */
        ReviewFileFromInputModel: {
            get: function () {
            	return ReviewFileFromInputModel;
            }
        },

        /**
         * @property {String} review-page.viewModel.ReviewFileFromModel ReviewFileFromModel
         * @description The model used to generate and retrieve a file based on the uploaded file.
         */
        ReviewFileModel: {
            get: function () {
                return ReviewFileModel;
            }
        },

		/**
		 * @property {String} review-page.viewModel.startTab startTab
		 * @description the tab show when the page loads with pui-tabs component
		 */
        startTab: {
            type: 'string',
            value: 'Enter URLs'
        },

		/**
		 * @property {Array<Object>} review-page.viewModel.tabsList tabsList
		 * @description list of tabs to show by the pui-tabs componenet
		 */
        tabsList: {
            value: [
                {
                    name: 'Enter URLs'
                },
                {
                    name: 'Upload File'
                }
            ]
        }
    },

    /**
     * @function review-page.viewmodel.toggleModal toggleModal
     * @description Function that toggles the Modal when Close button is clicked.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
