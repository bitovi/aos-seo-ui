require('can/map/define/define');
var can = require('can');
var _ = require('lodash');
var anatomyItemTemplate = require('./anatomy-item.stache');
var rowTemplate = require('./row.stache');

module.exports = can.Map.extend({
    define: {

        /**
         * @property {Array<can.Map>} url-list.viewModel.columns columns
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
                    cssClass: 'col-md-1',
                    key: 'url',
                    label: 'URL',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'pageTitle',
                    label: 'Page Title',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'editablepagetitle',
                    label: 'Editable Titles',
                    sorting: false
                },
                {
                    cssClass: 'col-md-2',
                    key: 'description',
                    label: 'Description',
                    sorting: false
                },
                {
                    cssClass: 'col-md-4',
                    key: 'editabledescription',
                    label: 'Editable Description',
                    sorting: false
                }
            ]
        },
        /**
         * @property {Function} url-list.viewModel.items
         * @description gets items from the state.storage.
         */
        items: {
            get: function () {
                return JSON.parse(localStorage.getItem('editMetadata'));
            }
        },

        /**
         * @property {Object} actionBarMenuActions
         * @description Actions used for action-bar-menu items
         */
        actionBarMenuActions: {
            value: function() {
                return {
                    cancelRequest: can.proxy(this.cancelRequest, this),
                    addMore: can.proxy(this.addMore, this)
                };
            }
        },

        /**
         * @property {Function} url-list.viewModel.anatomyItem anatomyItem
         * @description Stores the template that renders an anatomy item.
         */
        anatomyItem: {
            value: function () {
                return anatomyItemTemplate;
            }
        },

        /**
         * @property {function} url-list.viewModel.rowTemplate rowTemplate
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
     * @function edit-title-description.viewModel.cancelRequest
     * @description cancles edit title description request.
     */
    cancelRequest: function () {
        localStorage.removeItem('editMetadata');
        this.attr('state').setRouteAttrs({
            page: 'urls'
        });
    },

    /**
     * @function edit-title-description.viewModel.addMore
     * @description navigate to url page.
     */
    addMore: function () {        
        this.attr('state').setRouteAttrs({
            page: 'urls',
            addMore: true
        });
    }

});
