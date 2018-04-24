require('can-map-define');

var CanMap = require('can-map');

var envVars = require('seo-ui/utils/environmentVars');
var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var ExportProgressModel = require('seo-ui/models/export-progress/export-progress');

module.exports = CanMap.extend({
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
         * @property {String} review-page.viewModel.exportId exportId
         * @description ExportId needed to submit and download files.
         */
        exportId: {
            type: 'string',
            value: ''
        },

        /**
         * @property {CanModel} review-page.viewModel.ExportProgressModel ExportProgressModel
         * @description The model used to get the export progress for any file export.
         */
        ExportProgressModel: {
            get: function () {
                return ExportProgressModel;
            }
        },

        /**
        * @property {string} review-page.viewModel.exportRequest exportRequest
        * @description Data to be sent to the reviewFileFromInputPath export API
        */
        exportRequest: {
            type: 'string',
            get: function () {
                return JSON.stringify(this.attr('params').attr());
            }
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
         * @property {CanModel} review-page.viewModel.GenerateExportIdModel GenerateExportIdModel
         * @description The model used to get the exportId for the file export.
         */
        GenerateExportIdModel: {
            get: function () {
                return GenerateExportIdModel;
            }
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
         * @property {Array} review-page.viewModel.notifications notifications
         * @description List of notifications about export status
         */
        notifications: {
            Value: Array
        },

        /**
        * @property {Object} review-page.viewModel.params params
        * @description list of params to be submitted to the server
        * note: only for the reviewFileFromInputPath export API
        */
        params: {
            Value: Object
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
                if (newVal) {
                    this.attr('downloadBtnEnabled', Boolean(newVal.trim()));
                }
                return newVal;
            }
        }
    },

    /**
     * @function {function} review-page.viewModel.buildParams buildParams
     * @description builds query params for HTTP request that will be submitted in the request body.
     */
    buildParams: function () {
        var params = this.attr('params');
        params.attr('urlTexts', this.attr('urlTexts'));
        params.attr('exportId', this.attr('exportId'));
    },

    /**
     * @function review-page.viewmodel.getProgress getProgress
     * @description Function queries export progress status.
     */
    getProgress: function () {
        var self = this;
        var progressTimerId;

        this.attr('notifications').push({
            title: 'Your data export has started.',
            message: 'Please wait for the process to complete.',
            timeout: '5000',
            type: 'info'
        });

        progressTimerId = setInterval(function () {
            var progDef = ExportProgressModel.findOne({
                exportId: self.attr('exportId')
            });
            var alertConfig = {
                title: '',
                timeout: 5000,
                message: '',
                type: 'info'
            };
            var counter = 0;

            progDef.then(function (resp) {
                counter++;

                if (resp && resp.state) {
                    var respState = resp.state;

                    if (resp.errorMessage) {
                        alertConfig.message = resp.errorMessage;
                    }

                    // Remove previous alert message
                    setTimeout(function () {
                        self.attr('notifications').shift();
                    }, 1000);

                    // Only set the message when the BE is not sending a message
                    if (respState === 'progress') {
                        alertConfig.title = 'Export in Progress';
                        alertConfig.message = 'We are processing the file right now. Please wait till the process is completed.';

                        // Only in case of the first request do this once
                        if (counter === 1) {
                            // If the file download is still in progress state after
                            // 60 seconds then stop querying the Export PRogress API
                            setTimeout(function () {
                                clearTimeout(progressTimerId);
                            }, 60000);
                        }
                    } else {
                        // Stop Export progress API requests
                        clearTimeout(progressTimerId);

                        if (respState === 'success') {
                            alertConfig.title = 'Export Successful';
                            alertConfig.type = 'success';
                            alertConfig.message = 'The file has been downloaded successfully, please check your Downloads folder.';
                        } else if (respState === 'error') {
                            alertConfig.title = 'Export Failed';
                            alertConfig.type = 'error';
                        } else if (respState === 'warning') {
                            alertConfig.title = 'Warning: Export Completed with errors';
                            alertConfig.type = 'warning';
                        } else if (respState === 'alert') {
                            alertConfig.title = 'Alert: Export Completed with errors';
                            alertConfig.type = 'warning';
                        }
                    }
                // When the backend fails to send any error message, because of processing failure
                } else {
                    alertConfig.title = 'Export Failed';
                    alertConfig.type = 'error';
                    alertConfig.message = 'The server has failed processing the data that has been provided. Please make sure that the data and the data format are both correct and try again.';

                    clearTimeout(progressTimerId);
                }
            })
                .catch(function (resp) {
                    alertConfig.title = 'Not able to export';
                    alertConfig.type = 'error';
                    alertConfig.message = resp.statusText;

                    // Stop Export progress API requests
                    clearTimeout(progressTimerId);
                })
                .then(function () {
                    // Show alert message
                    self.attr('notifications').push({
                        title: alertConfig.title,
                        message: alertConfig.message,
                        timeout: alertConfig.timeout,
                        type: alertConfig.type
                    });

                    // Remove notification with a delay
                    setTimeout(function () {
                        self.attr('notifications').shift();
                    }, 10000);
                });
        }, 5000);
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
