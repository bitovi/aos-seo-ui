require('can/map/define/define');
var can = require('can');
var rowTemplate = require('./row.stache');
var RequestListModel = require('seo-ui/models/request-list/request-list');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array<can.Map>} request-detail.viewModel.columns columns
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
         * @property {Object} actionBarMenuActions
         * @description Actions used for action-bar-menu items
         */
        actionBarMenuActions: {
            value: function() {
                return {
                    navigateToRequestList: can.proxy(this.navigateToRequestList, this)
                };
            }
        },

        /**
         * @property {Object} request
         * @description gets request detail data.
         */
        request: {
            get: function (lastSetValue, setAttrValue) {
                var appState = this.attr('state');
                var requestPath = appState.attr('requestPath');

                if (requestPath) {
                    this.attr('model').findOne({id: requestPath})
                        .then(function(response){
                            setAttrValue(response.detail);
                        });
                }
            }
        },

        /**
         * @property {function} request-detail.viewModel.rowTemplate rowTemplate
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
     * @function navigateToRequestList
     * @description Navigates to the request list page when we click title on request detail page.
     */
    navigateToRequestList: function () {
        this.attr('state').setRouteAttrs({
            page: 'request-list'
        });
    }
});
