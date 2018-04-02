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
            set: function (newVal) {
                return newVal ? formatUtils.trimString(newVal) : '';
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
            set: function (newVal) {
                return newVal ? formatUtils.trimString(newVal) : '';
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
                     * @property {String} edit-metadata-list.viewModel.errors.title errors.title
                     * @description if valid value is false otherwise value is the validation error
                     * @option {String} Defaults to false
                     */
                    title: {
                        value: false
                    },
                    /**
                     * @property {String} edit-metadata-list.viewModel.errors.description errors.description
                     * @description if valid value is false otherwise value is the validation error
                     * @option {String} Defaults to false
                     */
                    description: {
                        value: false
                    },
                    /**
                     * @property {String} edit-metadata-list.viewModel.errors.dueDate errors.dueDate
                     * @description if valid value is false otherwise value is the validation error
                     * @option {String} Defaults to false
                     */
                    dueDate: {
                        value: false
                    },
                    /**
                     * @property {Boolean} edit-metadata-list.viewModel.errors.isValid errors.isValid
                     * @description Returns: true, if all the attrs are valid and false, if there is one or more errors.
                     */
                    isValid: {
                        get: function () {
                            return !this.attr('dueDate') && !this.attr('title') && !this.attr('description');
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
         * @property {String} dateMask
         * @description Date mask to use on user visible dates.
         * @option {String} Default is MM/DD/YYYY.
         */
        dateMask: {
            value: 'YYYY-MM-DD',
            type: 'string'
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

        /**
         * @property {Function} edit-metadata-list.viewModel.showModalLoader
         * @description show loader on pui modal while creating request.
         */
        showModalLoader: {
            value: false,
            type: 'boolean'
        },

        /**
         * @property {Function} edit-metadata-list.viewModel.showRadarDetails
         * @description show radar details.
         */
        showRadarDetails: {
            value: false,
            type: 'boolean'
        }
    },

    /**
     * @function eedit-metadata-list.viewModel.cancelRequest
     * @description cancles edit title description request.
     */
    cancelRequest: function () {
        localStorage.removeItem('editMetadata');
        this.attr('showRadarDetails', false);
        this.attr('state').setRouteAttrs({
            page: 'request-list'
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
            if (item.url === url) {
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
     * @param {String} val the value being validated
     */
    validateTitle: function (val) {
        var title;
        if (val instanceof $) {
            title = val.val();
        } else {
            title = val ? val : this.attr('title');
        }

        var errorTitle = title ? false : 'Title is required';
        this.attr('errors.title', errorTitle);
    },

    /**
     * @function edit-metadata-list.viewModel.validateDescription validateDescription
     * @description runs validation on [create-revision.viewModel.validateDescription] or the passed value
     * @param {String} val the value being validated
     */
    validateDescription: function (val) {
        var description;
        if (val instanceof $) {
            description = val.val();
        } else {
            description = val ? val : this.attr('description');
        }

        var errorDescription = description ? false : 'Description is required';
        this.attr('errors.description', errorDescription);
    },

    /**
     * @function create-revision.viewModel.validateDate validateDate
     * @description runs validation on [edit-metadata-list.viewModel.validateDate] or the passed value
     * @param {Boolean} hasVal if the function is being called with a specific value to validate
     * @param {String} val the value being validated
     */
    validateDate: function (hasVal, val) {
        var date = hasVal === true ? val : this.attr('currentDate');
        var today = moment().startOf('day');
        var scheduledPushDate = moment(date, 'MM/DD/YYYY').endOf('day');

        if (!date) {
            this.attr('errors.dueDate', 'Date is required.');
        } else if (!moment(date, 'MM/DD/YYYY').isValid()) {
            this.attr('errors.dueDate', 'Date is invalid.');
        } else if (scheduledPushDate.isBefore(today)) {
            this.attr('errors.dueDate', 'Date in the past.');
        } else {
            this.attr('errors.dueDate', false);
        }
    },

    /**
     * @function edit-metadata-list.viewModel.validate validate
     * @description runs validation on all fields being validated
     */
    validate: function () {
        can.batch.start();
        this.validateTitle();
        this.validateDate();
        this.validateDescription();
        can.batch.stop();
        return this.attr('errors.isValid');
    },

    /**
     * @function edit-metadata-list.viewModel.resetDefault
     * @description resets all the fields to their default values.
     */
    resetDefaults: function () {
        this.attr('title', '');
        this.attr('description', '');
        this.attr('currentDate', this.attr('minDate'));
        this.attr('errors.title', false);
        this.attr('errors.description', false);
        this.attr('errors.dueDate', false);
        if (this.attr('showRadarDetails')) {
            this.cancelRequest();
        }
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
                                assetType: contentItem.type,
                                assetUri: contentItem.name,
                                oldContent: contentItem.value,
                                newContent: typeof contentItem.newContent === 'undefined' ? contentItem.value : contentItem.newContent
                            });
                        }
                    });
                }

                if (item.descriptionAnatomy) {
                    item.descriptionAnatomy.forEach(function (contentItem) {
                        if (contentItem.editable && contentItem.type === 'text_asset') {
                            contents.push({
                                assetType: contentItem.type,
                                assetUri: contentItem.name,
                                oldContent: contentItem.value,
                                newContent: typeof contentItem.newContent === 'undefined' ? contentItem.value : contentItem.newContent
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

            this.attr('createRequest.dueDate', moment.utc(this.attr('currentDate')).format(this.attr('dateMask')));
            this.attr('createRequest.title', this.attr('title'));
            this.attr('createRequest.description', this.attr('description'));
            this.attr('createRequest.urls', urls);

            var createRequestData = this.attr('createRequest').attr();
            this.attr('showModalLoader', true);
            this.attr('createRequest').create(createRequestData).then(function (response) {
                self.attr('createRequest').findOne({id: response.detail.id}).then(function (resp) {
                    self.attr('showModalLoader', false);
                    self.attr('showRadarDetails', true);
                    self.attr('radarDetails', resp.detail);
                });
            });
        }
    },

    /**
     * @function edit-metadata-list.viewModel.hasEditableKey
     * @description checks editable key in the items.
     * @param {Array} items that need to be check for editable key.
     */
    hasEditableKey: function (items) {
        var editableItems = _.filter(items, function (item) {
            return item.editable && item.type === 'text_asset';
        });

        return editableItems.length > 0;
    }
});
