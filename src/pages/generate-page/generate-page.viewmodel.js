require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var GenerateExportIdModel = require('seo-ui/models/generate-file-export-id/generate-file-export-id');
var ExportProgressModel = require('seo-ui/models/export-progress/export-progress');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {String} generate-page.viewModel.exportId exportId
         * @description ExportId needed to submit and download a file
         */
        exportId: {
            type: 'string'
        },

        /**
         * @property {can.Model} generate-page.viewModel.ExportProgressModel ExportProgressModel
         * @description The model used to get the export progress for any file export/download.
         */
        ExportProgressModel: {
            get: function () {
                return ExportProgressModel;
            }
        },

        /**
         * @property {String} generate-page.viewModel.exportRequest exportRequest
         * @description The API of the service we need to call to export the file
         */
        exportRequest: {
            type: 'string',
            get: function () {
                this.attr('params.exportId', this.attr('exportId'));
                return JSON.stringify(this.attr('params').attr());
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
         * @description The model used to get the exportId for the file export/download
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
        },

        /**
         * @property {Object} generate-page.viewModel.params params
         * @description params to be sent to the server.
         */
        params: {
            value: {}
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
            message: 'Please check your Downloads folder for the export file.',
            timeout: '5000',
            type: 'info'
        });

        progressTimerId = setInterval(function () {
            var progDef = ExportProgressModel.findOne({
                exportId: self.attr('params.exportId')
            });

            progDef.then(function (resp) {
                if (resp && resp.state) {
                    var respState = resp.state;

                    if (respState === 'success' || respState === 'error') {
                        clearTimeout(progressTimerId);
                        setTimeout(function () {
                            self.attr('notifications').pop();
                        }, 3000);
                    }
                }
            })
            .fail(function (resp) {
                self.attr('notifications').push({
                    title: 'Not able to export',
                    message: resp.errorMessage,
                    timeout: '5000',
                    type: 'error'
                });
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
