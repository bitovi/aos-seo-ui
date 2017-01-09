var can = require('can');
require('can/map/define/define');
require('can/view/stache/stache');
var ExportProgress = require('seo-ui/models/export-progress/export-progress.js');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Map.extend({
    define: {
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
            value: []
        },
        /**
         * @property {Object} params
         * @description The params that needs to passed for exporting
         */
        params: {
            value: {}
        },

        exportId: {
          value: 'a032c602-0dee-4885-add4-13fb5337b5bb',
          type: 'string'
        }
    },
    /**
     * @function buildParams
     * @description builds the parameters that needs to be passed to  export the records
     */
    buildParams: function () {
        var params = this.attr('params');
        var state = this.attr('state');
        var searchFields = this.attr('searchFields');
        var filterFields = this.attr('filterFields');
        // tack on search/filter params
        if (params && state) {
            can.each(searchFields, function (val) {
                params.attr(val, state.attr(val));
            });
            can.each(filterFields, function (val) {
                params.attr(val, state.attr(val));
            });
            params.attr('sort', state.attr('sort') + ' ' + state.attr('order'));
            params.attr('limit', state.attr('limit'));
            params.attr('page', state.attr('pageNumber'));
        }
    },
    /**
     * @function export-urls.viewmodel.doExport doExport
     * @description Processes selected data and submits request for export file.
     */
    doExport: function () {
        var self = this;
        var progressTimerId;
        console.log('exportId=' + this.attr('exportId'));
        this.attr('notifications').replace([]);
        // build params to pass along with mc details
        this.buildParams();
        this.attr('exportClicked', true);
        // Set the file path for pui file downloader component
        this.attr('exportFilePath',
            envVars.apiUrl() + '/export-urls.json?' + window.seo.csrfParameter + '=' + window.seo.csrfToken);

        // this queues the pui-file-downloader component to download file (call export api)
        this.attr('doDownloadExport', true);

        this.attr('notifications').push({
            title: 'Your data export has started.',
            message: 'Please wait until the process has been completed and check your Downloads folder',
            timeout: '-1',
            type: 'info'
        });
        // self.attr('doDownloadExport', false);
        return can.Deferred(function (defer) {
            // Reset the download state so we can do an other download, if needed
            self.attr('doDownloadExport', false);

            progressTimerId = setInterval(function () {
                var progDef = ExportProgress.findOne({
                    exportId: self.attr('exportId')
                });

                progDef
                    .then(function (resp) {
                        if (resp && resp.state) {
                            var respState = resp.state;

                            if (respState === 'SUCCESS') {
                                defer.resolve(resp);
                            } else if (respState === 'ERROR') {
                                defer.reject(resp);
                            }
                        } else {
                            defer.reject();
                        }
                    })
                    .fail(function (resp) {
                        defer.reject(resp);
                    });
            }, 1000);
        })
        .always(function () {
            self.attr('notifications').pop();
            clearTimeout(progressTimerId);
        });
    },
    /**
     * @function export-urls.viewmodel.exportCsv exportCsv
     * @description Exports in the urls in the csv format
     */
    exportCsv: function () {
        var params = this.attr('params');
        params.attr('exportAll', false);
        this.doExport();
    },
    /**
     * @function export-urls.viewmodel.exportAllCsv exportAllCsv
     * @description Exports in the All urls in the csv format
     */
    exportAllCsv: function () {
        var params = this.attr('params');
        params.attr('exportAll', true);
        this.doExport();
    },
    /**
     * @function export-urls.viewmodel.exportNemoReadyFile exportNemoReadyFile
     * @description Exports in the urls in the nemo ready format
     */
    exportNemoReadyFile: function () {
        var params = this.attr('params');
        params.attr('nemoReady', true);
        this.doExport();
    }
});
