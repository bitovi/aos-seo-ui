require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Map.extend({
    define: {

        /**
         * @property {boolean} review-page.viewModel.doDownloadExport doDownloadExport
         * @description Indicator to trigger the file download, when set to true
         * submit the form to the URL and trigger the download
         */
        doDownloadExport: {
            value: false,
            type: 'boolean'
        },

        /**
         * @property {boolean} review-page.viewModel.downloadBtnEnabled downloadBtnEnabled
         * @description Indicates if the download button is enabled
         */
        downloadBtnEnabled: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {boolean} review-page.viewModel.fileToUpload fileToUpload
         * @description The file provided as value for the file-upload component that will be uploaded.
         */
        fileToUpload: {
            type: 'string',
            value: ''
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
         * @property {String} review-page.viewModel.reviewFileFromInputPath reviewFileFromInputPath
         * @description The URL/End-point of the service we need to invoke to download a file when providing a list of URLs.
         */
        reviewFileFromInputPath: {
            value: '',
            type: 'string',
            get: function () {
                // Adding CSRF token here, because the window.seo doesn't exist yet when the 'value' is set
                return envVars.apiUrl() + '/process-for-textarea-input.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken;
            }
        },

        /**
         * @property {String} review-page.viewModel.reviewFilePath reviewFilePath
         * @description The URL/End-point of the service we need to invoke to download a file when providing a file as input.
         */
        reviewFilePath: {
            value: '',
            type: 'string',
            get: function () {
                // Adding CSRF token here, because the window.seo doesn't exist yet when the 'value' is set
                return envVars.apiUrl() + '/process-csv-url.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken;
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
         * @property {String} review-page.viewModel.urlTexts urlTexts
         * @description List of URLs to upload to the server and get back as an exported file.
         */
        urlTexts: {
            type: 'string',
            value: '',
            set: function (newVal) {
                this.attr('downloadBtnEnabled', Boolean(newVal.trim()));

                return newVal;
            }
        }
    },

    /**
     * @function review-page.viewmodel.doDownload doDownload
     * @description Function that is fired when the Generate File button is clicked on the Enter URLs tab.
     */
    doDownload: function () {
        // Start the export
        this.attr('doDownloadExport', true);
        // Reset the variable to enable doing the export again
        this.attr('doDownloadExport', false);
    },

    /**
     * @function review-page.viewmodel.toggleModal toggleModal
     * @description Function that toggles the Modal when Close button is clicked.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    },

    /**
     * @function review-page.viewmodel.updateUrlText updateUrlText
     * @description Updates the URLtexts textarea.
     */
    updateUrlText: function (text) {
        this.attr('urlTexts', text);
    }
});
