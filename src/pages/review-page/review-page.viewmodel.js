require('can/map/define/define');

var can = require('can');

var ReviewFileInputModel = require('seo-ui/models/review-file-input/review-file-input');

module.exports = can.Map.extend({
    define: {
    	/**
		 * @property {String} review-page.viewModel.generateFileFromInputModel generateFileFromInputModel
		 * @description The model used to generate and retrieve a file based on input.
		 */
        reviewFileInputModel: {
            get: function () {
            	return ReviewFileInputModel;
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
		 * @property {Object} review-page.viewModel.params params
		 * @description params to be sent to the server.
         */
        params: {
            value: {}
        }
    },

	/**
     * @function review-page.viewmodel.buildParams buildParams
     * @description buils params for POST request
     */
    buildParams: function () {
        var params = this.attr('params');

        // make an AJAX call to get an ExportId
        // + need to create a model for that

        params.attr('exportId', this.attr('exportId'));
        params.attr('URLs', this.attr('URLs'));
    },

    /**
     * @function review-page.viewmodel.generateFileFromInput generateFileFromInput
     * @description Gets the input from the textarea, sends it to the backend and 
     * downloads the generated file.
     */
    generateFileFromInput: function () {
    	this.buildParams();

        var params = this.attr('params');
console.log(params);
		this.reviewFileInputModel.findOne(params);
    },

    /**
     * @function review-page.viewmodel.toggleModal toggleModal
     * @description Function that toggles the Modal when Close button is clicked.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
