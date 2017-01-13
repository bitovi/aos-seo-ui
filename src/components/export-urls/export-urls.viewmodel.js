require('can/map/define/define');
require('can/view/stache/stache');

var $ = require('jquery');
var can = require('can');
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
        }
    },

    /**
     * @function buildParams
     * @description builds the parameters that needs to be passed to export the records
     * @param {Object} [extraParams] Optional object containing additional parameters
     */
    buildParams: function (extraParams) {
        var filterFields = this.attr('filterFields');
        var params = new can.Map();
        var searchFields = this.attr('searchFields');
        var state = this.attr('state');

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
            params.attr('id', this.attr('exportId'));

            this.attr('params', $.extend(params.attr(), extraParams));
        }
    },

    /**
     * @function export-urls.viewmodel.doExport doExport
     * @description Processes selected data and submits request for export file.
     */
    doExport: function () {
        var self = this;

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

        self.attr('doDownloadExport', false);
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
            nemoReady: true,
            pageTypes: 'buyflow'
        });

        this.doExport();
    }
});
