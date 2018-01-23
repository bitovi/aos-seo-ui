require('can/map/define/define');
var can = require('can');
var _ = require('lodash');
var anatomyItemTemplate = require('./anatomy-item.stache');
var rowTemplate = require('./row.stache');
var moment = require('moment');

var CreateRequest = require('seo-ui/models/edit-metadata/create-request');

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

        createRequest: {
            Type: CreateRequest,
            value: {}
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
                    addMore: can.proxy(this.addMore, this),
                    raiseRequest: can.proxy(this.raiseRequest, this)
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
         * @property {string} now
         * @description Shows current date
         */
        now: {
            value: moment().format('MM/DD/YYYY'),
            type: 'string'
        },

        /**
         * @property {string} min
         * @description set's minimum date
         */
        min: {
            value: moment().format('MM/DD/YYYY'),
            type: 'string'
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
    },

    /**
     * @function showActivity
     * @description Shows activity modal of the raise request.
     */
    raiseRequest: function() {
        this.attr('isActive', !this.attr('isActive'));
    },

    submitRequest: function () {
        //$('td.editablepagetitle').eq(0).find('textarea').val()

        var parts = [];
        var selectedUrls = [];
        var selectedPageTypes = [];
        var contents = [];

        this.attr('items').forEach(function (item) {
            parts.push(item.partNumber);
            selectedUrls.push(item.url);
            selectedPageTypes.push(pageType);

            if (item.attr('titleAnatomy')) {
                item.attr('titleAnatomy').forEach(function (contentItem) {
                    if (contentItem.attr('type') === 'text_asset') {
                        contents.push({
                            "assetType" : contentItem.attr('type'),
                            "assetUri" : contentItem.attr('name'),
                            "oldContent" : contentItem.attr('value'),
                            "newContent" : "new value"
                        })
                    }
                });
            }

            if (item.attr('descriptionAnatomy')) {
                item.attr('descriptionAnatomy').forEach(function (contentItem) {
                    if (contentItem.attr('type') === 'text_asset') {
                        contents.push({
                            "assetType" : contentItem.attr('type'),
                            "assetUri" : contentItem.attr('name'),
                            "oldContent" : contentItem.attr('value'),
                            "newContent" : "new value"
                        })
                    }
                });
            }
        });
        
        this.attr('createRequest.selectedPartNumbers', _.uniq(parts));
        this.attr('createRequest.selectedUrls', selectedUrls);
        this.attr('createRequest.selectedPageTypes', selectedPageTypes);
        this.attr('createRequest.contents', contents);

        var requestBody = this.attr('createRequest').attr();

        this.attr('createRequest').create(requestBody).then(function(response){
            console.log('Response Data', response);
        });
    }
});
