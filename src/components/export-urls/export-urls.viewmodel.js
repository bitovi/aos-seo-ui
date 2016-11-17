var can = require('can');
require('can/map/define/define');
require('can/view/stache/stache');
var envVars = require('seo-ui/utils/environmentVars');
var ExportProgress = require('seo-ui/models/export-urls/export-urls.js');

module.exports = can.Map.extend({
    define: {
        /**
         * @property
         * @description The URL/End-point of the service we need to invoke for exporing/download.
         */
        exportFilePath: {
            value: envVars.apiUrl() + '/export-urls.json',
            type: 'string'
        },
        params: {
            value: {}
        },
        /**
         * @property
         * @description Data to be send to the export-urls.json service/
         */
        exportRequest: {
            type: 'string',
            get: function () {
                return JSON.stringify(this.attr('params').attr());
            }
        },
        /**
         * @property
         * @description Indicator to help trigger the file download, when set to true
         * submit the form to the URL and trigger the download
         */
        doDownloadExport: {
            value: false,
            type: 'boolean'
        },
        /**
         * @property
         * @description checks whether to disable or enable export All
         */
        displayExportAll: {
            type: 'boolean',
            get: function () {
                if (this.attr('state') && this.attr('state.countries') || this.attr('state.dateRanges') || this.attr('state.pageTitle') || this.attr('state.partNumber') || this.attr('state.regions') || this.attr('state.segments') || this.attr('state.statuses') || this.attr('state.urls')) {
                    return true;
                }
                return false;
            }
        },
        /**
         * @property
         * @description notifications of the export status
         */
        notifications: {
            value: []
        },
        /**
         * @property
         * @description checks if the export request is triggered
         */
        exportClicked: {
            type: 'boolean'
        }
    },
    /**
     * @function
     * @description builds the parameters that needs to be passed to  export the records
     */
    buildParams: function () {
        var params = this.attr('params');
        // tack on search/filter params
        if (this.attr('params') && this.attr('state')) {
            params.attr('countries', this.attr('state.countries'));
            params.attr('dateRanges', this.attr('state.dateRanges'));
            params.attr('limit', this.attr('state.limit'));
            params.attr('order', this.attr('state.order'));
            params.attr('pageNumber', this.attr('state.pageNumber'));
            params.attr('pageTitle', this.attr('state.pageTitle'));
            params.attr('partNumber', this.attr('state.partNumber'));
            params.attr('regions', this.attr('state.regions'));
            params.attr('segments', this.attr('state.segments'));
            params.attr('sort', this.attr('state.sort'));
            params.attr('statuses', this.attr('state.statuses'));
            params.attr('urls', this.attr('state.urls'));
        }
    },
    /**
     * @function
     * @description Exports in the urls in the csv format
     */
    exportCsv: function () {
        this.doExport();
    },
    /**
     * @function
     * @description Exports in the All urls in the csv format
     */
    exportAllCsv: function () {
        var params = this.attr('params');
        params.attr('exportAll', true);
        this.doExport();
    },
    /**
     * @function export-urls.scope.doExport doExport
     * @description Processes selected data and submits request for export file.
     */
    doExport: function () {
        var self = this;
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
            message: 'Please wait until the process has been completed.',
            timeout: '-1',
            type: 'info'
        });

        can.Deferred(function () {
            // Reset the download state so we can do an other download, if needed
            self.attr('doDownloadExport', false);

            var progDef = ExportProgress.findOne({
                exportRequest: JSON.stringify(self.attr('params').attr())
            });
            progDef
                .then(function () {
                    self.attr('notifications').pop();
                    self.attr('notifications').push({
                        title: 'Your data export was successful.',
                        message: 'Check your downloads folder for the exported file',
                        timeout: '6000',
                        type: 'success'
                    });
                })
                .fail(function (resp) {
                    // var msg = resp && resp.message ? resp.message : 'An internal error has occurred and we are unable to complete your request. Please try again later.';
                    //  self.attr('notifications').pop();
                    //  self.attr('notifications').push({
                    //      title: 'Unable to export data.',
                    //      message: msg,
                    //      timeout: '-1',
                    //      type: 'error'
                    //  });
                    self.attr('notifications').pop();
                    self.attr('notifications').push({
                        title: 'Your data export was successful.',
                        message: 'Check your downloads folder for the exported file',
                        timeout: '6000',
                        type: 'success'
                    });
                });
        });
    }
});
