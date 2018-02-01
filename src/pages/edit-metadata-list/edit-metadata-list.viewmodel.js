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

        /**
         * @property {can.Model} createRequest
         * @description The createRequest modal.
         */

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
         * @property {string} currentDate
         * @description Shows current date
         */
        currentDate: {
            value: moment().format('MM/DD/YYYY'),
            type: 'string'
        },

        /**
         * @property {string} minDate
         * @description set's minimum date
         */
        minDate: {
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
     * @function edit-title-description.viewModel.generateUniqueId
     * @description genarates a unique id from url.
     * @param url {string} row url.
     */
    generateUniqueId: function (url) {
        return url.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    },

    /**
     * @function showActivity
     * @description Shows activity modal of the raise request.
     */
    raiseRequest: function() {
        this.attr('isActive', !this.attr('isActive'));
    },

    /**
     * @function updateItems
     * @description update new content to the field.
     */
    updateItems: function (newVal, url, type, index) {
        this.attr('items').forEach(function (item) {
            if(item.url === url) {
                if (type === 'titleAnatomy') {
                    item.titleAnatomy[index].newContent = newVal;
                } else {
                    item.descriptionAnatomy[index].newContent = newVal;
                }
            }
        });
    },

    /**
     * @function submitRequest
     * @description submits request with updated titles and descriptions.
     */
    submitRequest: function () {
        var urls = [];        
        var self = this;

        this.attr('items').forEach(function (item) {
            var urlItem = {};
            var contents = [];

            if (item.titleAnatomy) {
                item.titleAnatomy.forEach(function (contentItem) {
                    if (contentItem.editable && contentItem.type === 'text_asset') {
                        contents.push({
                            "assetType" : contentItem.type,
                            "assetUri" : contentItem.name,
                            "oldContent" : contentItem.value,
                            "newContent" : typeof contentItem.newContent === 'undefined' ? contentItem.value : contentItem.newContent
                        });
                    }
                });
            }

            if (item.descriptionAnatomy) {
                item.descriptionAnatomy.forEach(function (contentItem) {
                    if (contentItem.editable && contentItem.type === 'text_asset') {
                        contents.push({
                            "assetType" : contentItem.type,
                            "assetUri" : contentItem.name,
                            "oldContent" : contentItem.value,
                            "newContent" : typeof contentItem.newContent === 'undefined' ? contentItem.value : contentItem.newContent
                        });
                    }
                });
            }
            
            urlItem.url = item.url;
            urlItem.partNumber = item.partNumber;
            urlItem.pageType = item.pageType;
            urlItem.segment = item.segment;
            urlItem.geo = item.region;
            urlItem.contents = contents;
            urls.push(urlItem);
        });

        this.attr('createRequest.dueDate', this.attr('now'));
        this.attr('createRequest.urls', urls);        

        var createRequestData = this.attr('createRequest').attr();

        this.attr('createRequest').create(createRequestData).then(function(response){
            self.cancelRequest();
        });
    }
});
