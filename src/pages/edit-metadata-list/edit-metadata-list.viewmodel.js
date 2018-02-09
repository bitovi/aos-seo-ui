require('can/map/define/define');
var can = require('can');
var _ = require('lodash');
var anatomyItemTemplate = require('./anatomy-item.stache');
var rowTemplate = require('./row.stache');
var moment = require('moment');

var CreateRequest = require('seo-ui/models/edit-metadata/create-request');
var formatUtils = require('seo-ui/utils/format-utils');

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
         * @property {String} edit-metadata-list.viewModel.title title
         * @description title of the request
         * @option {String} Defaults to ''
         */
        title: {
            value: '',
            type: 'string',
            set: function (newVal, oldVal) {
                if (typeof oldVal === 'undefined') {
                    return newVal;
                }
                newVal = formatUtils.trimString(newVal);
                return newVal;
            }
        },

        /**
         * @property {String} edit-metadata-list.viewModel.description description
         * @description description of the request
         * @option {String} Defaults to ''
         */
        description: {
            value: '',
            type: 'string',
            set: function (newVal, oldVal) {
                if (typeof oldVal === 'undefined') {
                    return newVal;
                }
                newVal = formatUtils.trimString(newVal);
                return newVal;
            }
        },

        /**
         * @property {Function} edit-metadata-list.viewModel.items
         * @description gets items from the state.storage.
         */
        items: {
            get: function () {
                return JSON.parse(localStorage.getItem('editMetadata'));
            }
        },

        /**
         * @property {can.Map} edit-metadata-list.viewModel.errors errors
         * @description errors is an observable map of the views current validation state
         */
        errors: {
            value: can.Map.extend({
                define: {
                    /**
                     * @property {String} create-revision.viewModel.errors.title errors.title
                     * @description if valid value is false otherwise value is the validation error
                     * @option {String} Defaults to false
                     */
                    title: {
                        value: false
                    },
                    /**
                     * @property {String} create-revision.viewModel.errors.description errors.description
                     * @description if valid value is false otherwise value is the validation error
                     * @option {String} Defaults to false
                     */
                    description: {
                        value: false
                    },
                    /**
                     * @property {Boolean} create-revision.viewModel.errors.isValid errors.isValid
                     * @description Returns: true, if all the attrs are valid and false, if there is one or more errors.
                     */
                    isValid: {
                        get: function () {
                            return !this.attr('title') && !this.attr('description');
                        }
                    }
                }
            })
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
         * @property {Function} edit-metadata-list.viewModel.anatomyItem anatomyItem
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
     * @function eedit-metadata-list.viewModel.cancelRequest
     * @description cancles edit title description request.
     */
    cancelRequest: function () {
        localStorage.removeItem('editMetadata');
        this.attr('state').setRouteAttrs({
            page: 'urls'
        });
    },

    /**
     * @function edit-metadata-list.viewModel.addMore
     * @description navigate to url page.
     */
    addMore: function () {        
        this.attr('state').setRouteAttrs({
            page: 'urls',
            addMore: true
        });
    },

    /**
     * @function edit-metadata-list.viewModel.generateUniqueId
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
     * @function edit-metadata-list.viewModel.validateTitle validateTitle
     * @description runs validation on [create-revision.viewModel.name] or the passed value
     * @param {String} title the value being validated
     */
    validateTitle: function (title) {
        var errorTile = title ? false : 'Title is required';
        this.attr('errors.title', errorTile);
    },
 
    /**
     * @function edit-metadata-list.viewModel.validateDescription validateDescription
     * @description runs validation on [create-revision.viewModel.name] or the passed value
     * @param {String} description the value being validated
     */
    validateDescription: function (description) {
        var errorDescription = description ? false : 'Description is required';
        this.attr('errors.description', errorDescription);
    },

    /**
     * @function edit-metadata-list.viewModel.validate validate
     * @description runs validation on all fields being validated
     */
    validate: function () {
        can.batch.start();
        this.validateTitle();
        this.validateDescription();
        can.batch.stop();
        return this.attr('errors.isValid');
    },

    /**
     * @function submitRequest
     * @description submits request with updated titles and descriptions.
     */
    submitRequest: function () {
        var urls = [];        
        var self = this;

        if (self.validate()) {

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

            this.attr('createRequest.dueDate', this.attr('currentDate'));
            this.attr('createRequest.title', this.attr('title'));
            this.attr('createRequest.description', this.attr('description'));
            this.attr('createRequest.urls', urls);

            var createRequestData = this.attr('createRequest').attr();

            this.attr('createRequest').create(createRequestData).then(function(response){
                self.cancelRequest();
            });
        }
    }
});
