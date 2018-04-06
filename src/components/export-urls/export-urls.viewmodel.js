require('can-map-define');
require('can-stache');

var $ = require('jquery');
var each = require('can-util/js/each/each');
var CanMap = require('can-map');
var envVars = require('seo-ui/utils/environmentVars');
var ExportProgress = require('seo-ui/models/export-progress/export-progress.js');

module.exports = CanMap.extend({
    define: {
        /**
         * @property {Array} configurableColumns
         * @description columns set for export.
         */
        configurableColumns: {
            Value: Array,
            get: function () {
                var columns = this.attr('columns');
                var visibleColumns = [];

                // Identify visible columns for export
                columns.forEach(function (column) {
                    if (column.attr('isVisible')) {
                        visibleColumns.push(column.attr('key'));
                    }
                });

                return visibleColumns;
            }
        },

        /**
         * @property {Boolean} doDownloadExport
         * @description Indicator to help trigger the file download, when set to true
         * submit the form to the URL and trigger the download
         */
        doDownloadExport: {
            value: false,
            type: 'boolean'
        },

        /**
         * @property {Boolean} exportClicked
         * @description checks if the export request is triggered
         */
        exportClicked: {
            type: 'boolean'
        },

        /**
         * @property {String} exportFilePath
         * @description The URL/End-point of the service we need to invoke for exporing/download.
         */
        exportFilePath: {
            value: envVars.apiUrl() + '/export-urls.json',
            type: 'string'
        },

        /**
         * @property {Object} exportId
         * @description The exportId for which the data needs to be exported.
         */
        exportId: {
            type: 'string'
        },

        /**
         * @property {String} exportRequest
         * @description Data to be send to the export-urls.json service/
         */
        exportRequest: {
            type: 'string',
            get: function () {
                return JSON.stringify(this.attr('params').attr());
            }
        },

        /**
         * @property {String} isLoading
         * @description export progress indication.
         */
        isLoading: {
            type: 'boolean',
            value: false
        },

        /**
         * @property {Array} notifications
         * @description notifications of the export status
         */
        notifications: {
            Value: Array
        },

        /**
         * @property {Object} params
         * @description The params that needs to passed for exporting
         */
        params: {
            value: {}
        }
    },

    /**
     * @function buildParams
     * @description builds the parameters that needs to be passed to export the records
     * @param {Object} [extraParams] Optional object containing additional parameters
     */
    buildParams: function (extraParams) {
        var filterFields = this.attr('filterFields');
        var params = new CanMap();
        var searchFields = this.attr('searchFields');
        var state = this.attr('state');

        // tack on search/filter params
        if (state) {
            each(searchFields, function (val) {
                params.attr(val, state.attr(val));
            });

            each(filterFields, function (val) {
                params.attr(val, state.attr(val));
            });

            params.attr('sort', state.attr('sort') + ' ' + state.attr('order'));
            params.attr('limit', state.attr('limit'));
            params.attr('page', state.attr('pageNumber'));
            params.attr('id', this.attr('exportId'));
            params.attr('configurableColumns', this.attr('configurableColumns'));

            this.attr('params', $.extend(params.attr(), extraParams));
        }
    },

    /**
     * @function export-urls.viewmodel.doExport doExport
     * @description Processes selected data and submits request for export file.
     */
    doExport: function () {
        var self = this;
        var progressTimerId;

        this.attr('notifications').replace([]);
        this.attr('exportClicked', true);
        // Set the file path for pui file downloader component
        this.attr('exportFilePath',
            envVars.apiUrl() + '/export-urls.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);

        // this queues the pui-file-downloader component to download file (call export api)
        this.attr('doDownloadExport', true);

        this.attr('notifications').push({
            title: 'Your data export has started.',
            message: 'Please wait until the process has been completed and check your Downloads folder',
            timeout: '5000',
            type: 'info'
        });

        this.attr('doDownloadExport', false);

        return new Promise(function (resolve, reject) {
            progressTimerId = setInterval(function () {
                var progDef = ExportProgress.findOne({
                    exportId: self.attr('exportId')
                });

                progDef
                    .then(function (resp) {
                        self.attr('isLoading', true);
                        if (resp && resp.state) {
                            var respState = resp.state;
                            var message;

                            if (self.attr('params.nemoReadyExport')) {
                                message = 'The file will download momentarily, NOTE: Export will not include pages with product attributes for page title or description';
                            } else {
                                message = 'The file will download momentarily.';
                            }

                            if (respState === 'success') {
                                self.attr('isLoading', false);
                                resolve(resp);
                                self.attr('notifications').push({
                                    title: 'Export completed without errors.',
                                    message: message,
                                    timeout: '-1',
                                    type: 'success'
                                });
                            } else if (respState === 'progress') {
                                self.attr('isLoading', true);
                            } else if (respState === 'alert') {
                                reject(resp);
                                self.attr('isLoading', false);
                                self.attr('notifications').push({
                                    title: resp.errorMessage,
                                    timeout: '-1',
                                    type: 'info'
                                });
                            } else if (respState === 'error') {
                                reject(resp);
                                self.attr('isLoading', false);
                                self.attr('notifications').push({
                                    title: 'Data export has failed.',
                                    message: resp.errorMessage,
                                    timeout: '-1',
                                    type: 'error'
                                });
                            }
                        }
                    })
                    .catch(function (resp) {
                        reject(resp);
                        self.attr('notifications').push({
                            title: 'Not able to export',
                            message: resp.errorMessage,
                            timeout: '5000',
                            type: 'error'
                        });
                    });
            }, 3000);
        }).then(function () {
            self.attr('notifications').pop();
            clearTimeout(progressTimerId);
        }).catch(function (err) {
            self.attr('notifications').pop();
            clearTimeout(progressTimerId);

            throw err;
        });
    },

    /**
     * @function export-urls.viewmodel.exportCsv exportCsv
     * @description Exports in the urls in the csv format
     */
    exportCsv: function () {
        this.buildParams();
        this.doExport();
    },

    /**
     * @function export-urls.viewmodel.exportAllCsv exportAllCsv
     * @description Exports in the All urls in the csv format
     */
    exportAllCsv: function () {
        this.buildParams({
            exportAll: true
        });

        this.doExport();
    },

    /**
     * @function export-urls.viewmodel.exportNemoReadyFile exportNemoReadyFile
     * @description Exports in the urls in the nemo ready format
     */
    exportNemoReadyFile: function () {
        this.buildParams({
            exportAll: true,
            nemoReadyExport: true
        });

        this.doExport();
    }
});
