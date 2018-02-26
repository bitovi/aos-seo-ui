require('can/map/define/define');
var can = require('can');
var Model = require('seo-ui/models/edit-metadata/create-request');

module.exports = can.Map.extend({
    define: {

        /**
         * @property {String} title
         * @description The title of the page
         */
        title: {
            value: 'Request List'
        },

        /**
         * @property {Array<Object>} columns
         * @description The list of columns (key name, header label, column width) used by the Grid List.
         */
        columns: {
            Type: can.List
        },


        /**
         * @property {Number} currentPage
         * @description The current page number.
         */
        currentPage: {
            type: 'number',
            value: 1
        },

        items: {},

        searchStateEnabled: {
            value: true
        },

        multiSearchEnabled: {
            value: false
        },

        multiSearchActive: {
            value: false
        },

        searchValue: {
            value: ''
        },

        searchField: {
            value: 'radarNumber'
        },

        advanceSearchDataOptions: {
            value: [
                {
                    key: 'radarNumber',
                    label: 'Radar Number'
                },
                {
                    key: 'radarTitle',
                    label: 'Radar Title'
                },
                {
                    key: 'radarDescription',
                    label: 'Radar Description'
                },{
                    key: 'state',
                    label: 'State'
                },{
                    key: 'subState',
                    label: 'Sub State'
                },{
                    key: 'createUser',
                    label: 'Create User'
                }
            ]
        },

        /**
         * @property {Array<can.Map>} url-list.viewModel.dataOptions dataOptions
         * @description A list of search-able keys/columns, used by the Grid Search component.
         */
        dataOptions: {
            value: [
                {
                    key: 'radarNumber',
                    label: 'Radar Number'
                },
                {
                    key: 'radarTitle',
                    label: 'Radar Title'
                },
                {
                    key: 'radarDescription',
                    label: 'Radar Description'
                },{
                    key: 'state',
                    label: 'State'
                },{
                    key: 'subState',
                    label: 'Sub State'
                },{
                    key: 'createUser',
                    label: 'Create User'
                }
            ]
        },

        /**
         * @property {Array<can.Map>} edit-metadata-list.viewModel.columns columns
         * @description The list of columns (key name, header label, column width) used by the Grid List.
         */
        columns: {
            value: [
                {
                    cssClass: 'col-md-2',
                    key: 'radarNumber',
                    label: 'Radar Number',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'radarTitle',
                    label: 'Radar Title',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'radarDescription',
                    label: 'Radar Description',
                    sorting: true
                },
                {
                    cssClass: 'col-md-1',
                    key: 'state',
                    label: 'State',
                    sorting: true
                },
                {
                    cssClass: 'col-md-1',
                    key: 'subState',
                    label: 'Sub State',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'createUser',
                    label: 'Create User',
                    sorting: true
                },
                {
                    cssClass: 'col-md-2',
                    key: 'createDate',
                    label: 'Create Date',
                    sorting: true
                }
            ]
        },

        /**
         * @property {Array<Object>} items
         * @description Array of item objects to display in the Grid List.
         */
        //items: {},

        model: {
            get: function () {
                return Model;
            }
        },

        /**
        * @property {String} sortBy
        * @description returns name of the column on which the list is to be sorted
        */
        sortBy: {
            type: 'string',
            set: function () {
                var searchField = this.attr('searchField');
                var state = this.attr('state');
                var stateValue = state.attr(searchField) || '';
                var fieldIsSortable = this.attr('unsortableColumns').indexOf(searchField) === -1;
                this.attr('sortOrder', fieldIsSortable && stateValue ? 'asc' : 'desc');
                return fieldIsSortable && stateValue ? searchField : 'modifyDate';
            }
        },

        sortOrder: {
            type: 'string',
            value: function () {
                return this.attr('state.order');
            },
            set: function (newVal) {
                return newVal;
            }
        },

        contentSearch: {
            get: function () {
                var value,
                    basicSearch = this.attr('searchQuery'),
                    multiSearch = this.attr('searchFilter');

                if (this.attr('searchStateEnabled') && basicSearch && basicSearch.attr('field') === 'content') {
                    value = basicSearch.attr('value');
                } else if (this.attr('multiSearchActive') && multiSearch && multiSearch.attr('content')) {
                    value = multiSearch.attr('content');
                }

                return value;
            }
        },

        /**
        * @property {Array} unsortableColumns
        * columns that are not sortable
        */
        unsortableColumns: {
            Type: Array,
            get: function () {
                return unsortableColumns(this.attr('columns'));
            }
        }
    },
    enableBasicSearch: function () {
        if (!this.attr('searchStateEnabled')) {
            this.attr('searchStateEnabled', true);
            this.attr('multiSearchEnabled', false);
            this.attr('multiSearchActive', false);

            $('#multi-search').collapse('hide');
        }
    }, 

    toggleAdvSearchTab: function () {
        var searchEnabled = this.attr('searchStateEnabled');
        var multiSearchEnabled = this.attr('multiSearchEnabled');

        this.attr('multiSearchEnabled', !multiSearchEnabled);

        if (!this.attr('multiSearchActive')) {
            this.attr('searchStateEnabled', !searchEnabled);
        }
    }
});
