require('can/map/define/define');
var can = require('can');
var rowTemplate = require('./row.stache');
var RequestListModel = require('seo-ui/models/request-list/request-list');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array<can.Map>} edit-metadata-list.viewModel.columns columns
         * @description The list of columns (key name, header label, column width) used by the Grid List.
         */
        columns: {
            value: [
                {
                    cssClass: 'col-md-1',
                    key: 'partNumber',
                    label: 'Part #',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'url',
                    label: 'URL',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'pageType',
                    label: 'Page Type',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'segment',
                    label: 'Segment',
                    sorting: false
                },
                {
                    cssClass: 'col-md-1',
                    key: 'geo',
                    label: 'Region',
                    sorting: false
                },
                {
                    cssClass: 'col-md-3',
                    key: 'contents',
                    label: 'Asset Keys',
                    sorting: false
                }
            ]
        },

        /**
         * @property {Array<Object>} items
         * @description table data that is used by the Grid List.
         */
        items: {},

        /**
         * @property {Model} model
         * @description Model used in the Grid List.
         */

        model: {
            type: '*',
            get: function () {
                return RequestListModel;
            }
        },

        /**
         * @property {function} edit-metadata-list.viewModel.rowTemplate rowTemplate
         * @description Stores the template renderer function reference.
         */
        rowTemplate: {
            value: function () {
                return function () {
                    return rowTemplate;
                };
            }
        },
    },

    /**
     * @function getRequestDetails
     * @description Get the request id of the click item and json of it's.
     * @param requestId iD of the selected request.
     */
    getRequestDetails: function (requestId) {
        var self = this;

        self.attr('model').findOne({id: requestId}).then(function (resp) {
            self.attr('detailData',resp.detail);
            self.attr('items',resp.detail.urls);
        });  
    },

    /**
     * @function navigateToRequestList
     * @description Navigates to the request list page when we click title on request detail page.
     */
    navigateToRequestList: function () {
        this.attr('state').setRouteAttrs({
            page: 'request-list'
        });
    }
});
