require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var ExportProgressModel = require('seo-ui/models/export-progress/export-progress');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {String} generate-page.viewModel.exportId exportId
         * @description ExportId needed to submit and download files.
         */
        exportId: {
            type: 'string'
        },

        /**
         * @property {can.Model} generate-page.viewModel.ExportProgressModel ExportProgressModel
         * @description The model used to get the export progress for any file export.
         */
        ExportProgressModel: {
            get: function () {
                return ExportProgressModel;
            }
        },

        /**
         * @property {String} generate-page.viewModel.fileToUpload fileToUpload
         * @description The file provided as value for the file-upload component that will be uploaded.
         */
        fileToUpload: {
            type: 'string',
            value: ''
        },

        /**
         * @property {can.Model} generate-page.viewModel.GenerateExportIdModel GenerateExportIdModel
         * @description The model used to get the exportId for the file export.
         */
        GenerateExportIdModel: {
            get: function () {
                return GenerateExportIdModel;
            }
        },

        /**
         * @property {String} generate-page.viewModel.generateFilePath generateFilePath
         * @description The URL/End-point of the service we need to invoke for exporing/download
         */
        generateFilePath: {
            value: '',
            type: 'string',
            get: function () {
                return envVars.apiUrl() + '/process-publishing-ready-file.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken;
            }
        },

        /**
         * @property {boolean} generate-page.viewModel.modalOpen modalOpen
         * @description shows if the modal window is open or not
         */
        modalOpen: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {Array} generate-page.viewModel.notifications notifications
         * @description List of notifications about export status
         */
        notifications: {
            Value: Array
        }
    },

    /**
     * @function generate-page.viewmodel.getProgress getProgress
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

            progDef.then(function (resp) {
                if (resp && resp.state) {
                    var respState = resp.state;

                    if (resp.errorMessage) {
                        alertConfig.message = resp.errorMessage;
                    }

                    // Remove first alert message
                    setTimeout(function () {
                        self.attr('notifications').shift();
                    }, 5000);

                    // Only setting the message in two cases (alert, progress) 
                    // when the BE is nto sending a message to the UI
                    if (respState === 'progress') {
                        alertConfig.title = 'Export in Progress';
                        alertConfig.message = 'We are porcessing the file right now. Please wait till the process completes.';
                    } else {
                        // Stop Export progress API requests
                        clearTimeout(progressTimerId);

                        if (respState === 'success') {
                            alertConfig.title = 'Export Successful';
                            alertConfig.message = 'File has been downloaded successfully, please check your Downloads folder.';
                        } else if (respState === 'error') {
                            alertConfig.title = 'Export Failed';
                            alertConfig.type = 'error';
                        } else if (respState === 'warning') {
                            alertConfig.title = 'Warning: Export Completed with errors';
                        } else if (respState === 'alert') {
                            alertConfig.title = 'Alert: Export Completed with errors';
                        }
                    }
                }
            })
            .fail(function () {
                alertConfig.title = 'Not able to export';
                alertConfig.type = 'error';
            })
            .always(function () {
                // Show alert message
                self.attr('notifications').push({
                    title: alertConfig.title,
                    message: alertConfig.message,
                    timeout: alertConfig.timeout,
                    type: alertConfig.type
                });

                // Remove notification with a 3 second delay
                setTimeout(function () {
                    self.attr('notifications').shift();
                }, 5000);
            });
        }, 1000);
    },

    /**
     * @function generate-page.viewmodel.toggleModal toggleModal
     * @description Function that toggles the Modal when Close button is clicked.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
