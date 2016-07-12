var $ = require('jquery');
var can = require('can');

require('bootstrap/js/collapse');
require('can/map/define/define');
require('can/view/stache/stache');

require('pui/components/grid-list/grid-list');
require('pui/components/grid-multi-search/grid-multi-search');
require('pui/components/grid-search/grid-search');
require('pui/components/pagination/pagination');

var templateRenderer = function (newTemplate) {
    return function () {
        return newTemplate;
    };
};

module.exports = can.Map.extend(
    {
        define: {
            columns: {
                Type: can.List
            },

            contentSearch: {
                get: function () {
                    var basicSearch = this.attr('searchQuery');
                    var multiSearch = this.attr('searchFilter');
                    var value;

                    if (this.attr('searchStateEnabled') && basicSearch && basicSearch.attr('field') === 'content') {
                        value = basicSearch.attr('value');
                    } else if (this.attr('multiSearchActive') && multiSearch && multiSearch.attr('content')) {
                        value = multiSearch.attr('content');
                    }

                    return value;
                }
            },

            currentPage: {
                type: 'number',
                value: 1
            },

            dataOptions: {
                Type: can.List
            },

            /* @property {Boolean} disableNewItem
             * @description Determine if the new item create button (+) should be shown or not
             */
            disableNewItemButton: {
                type: 'boolean',
                value: false
            },

            expandableRows: {
                type: 'boolean',
                value: false
            },

            expandedTemplate: {
                type: templateRenderer
            },

            items: {},

            // TODO: Is there a better way to pass a Constructor function without it being invoked?
            model: {
                type: '*'
            },

            multiSearchActive: {
                type: 'boolean',
                value: false
            },

            multiSearchEnabled: {
                type: 'boolean',
                value: false
            },

            /**
            * @property {function} rowTemplate
            * @description Stores the template renderer function reference.
            */
            rowTemplate: {
                type: templateRenderer
            },

            searchField: {
                type: 'string'
            },

            searchFilter: {
                Value: can.Map,
                set: function (searchFilter) {
                    // Update AppState/route
                    var searchFields = this.attr('searchFields');
                    var state = this.attr('state');

                    if (state) {
                        searchFields.forEach(function (searchField) {
                            state.removeAttr(searchField);
                        });

                        state.attr(searchFilter.attr());
                    }

                    // Removes context details from each item when the multi search query changes
                    this.clearContextDetails();

                    return searchFilter;
                }
            },

            searchFields: {
                get: function () {
                    var dataOptions = this.attr('dataOptions');

                    if (dataOptions) {
                        return dataOptions.attr().map(function (dataOption) {
                            return dataOption.key;
                        });
                    }
                }
            },

            searchQuery: {
                Value: can.Map,
                set: function (searchQuery) {
                    // Update AppState/route
                    var searchField = this.attr('searchField');
                    var state = this.attr('state');

                    if (state) {
                        state.attr(searchField, searchQuery.attr('value'));
                    }

                    // Removes context details from each item when the basic search query changes
                    this.clearContextDetails();

                    return searchQuery;
                }
            },

            searchStateEnabled: {
                type: 'boolean',
                value: true
            },

            searchValue: {
                type: 'string',
                value: ''
            },

            showNewItemModal: {
                type: 'boolean',
                value: false
            },

            title: {
                type: 'string',
                value: 'List Page'
            }
        },

        /**
         * @function clearContextDetails
         * @description Clears the contextDetails object from each list item.
         */
        clearContextDetails: function () {
            var items = this.attr('items');

            if (items) {
                items.each(function (item) {
                    item.removeAttr('contextDetails');
                    item.removeAttr('expanded');
                });
            }
        },

        /**
         * @function detailsUrl
         * @description Generates a marketing context-specific URL for an asset.
         * @param {can.Map} transMap One asset translation within a marketing context
         * @param {Object} transScope Mustache data, starting from the current translation
         */
        detailsUrl: function (transMap, transScope) {
            var appState = this.attr('state');
            var asset;
            var assetContent;
            var contextDetails;
            var mContext = transScope._parent;
            var mContextContent;
            var url = '#';

            if (mContext) {
                mContextContent = mContext._context;
                contextDetails = mContext._parent;
                asset = contextDetails._parent;
                assetContent = asset._context;

                if (mContextContent && assetContent) {
                    url = can.route.url({
                        fragmentKey: assetContent.keyPath,
                        page: 'fragment-details',
                        version: appState.attr('version')
                    });
                }
            }

            return url;
        },

        enableBasicSearch: function () {
            if (!this.attr('searchStateEnabled')) {
                this.attr('searchStateEnabled', true);
                this.attr('multiSearchEnabled', false);
                this.attr('multiSearchActive', false);

                $('#multi-search').collapse('hide');
            }
        },

        /**
         * @function enableNewItemModal
         * @description Shows the new item modal
         */
        enableNewItemModal: function () {
            this.attr('showNewItemModal', true);
        },

        /**
         * @function getContextDetails
         * @description Retrieves an asset's context details via API.
         * @param {can.Map} itemData The asset's data
         */
        getContextDetails: function (itemData) {
            var params = {
                    keyPath: itemData.attr('keyPath')
                },
                contentSearch = this.attr('contentSearch'),
                self = this;

            if (contentSearch) {
                params.content = contentSearch;
            }

            this.attr('isLoading', true);

            this.attr('model').getContextDetails(params)
                .then(function (details) {
                    if (!can.isEmptyObject(details)) {
                        itemData.attr('contextDetails', details);
                    }
                })
                .always(function () {
                    self.attr('isLoading', false);
                });
        },

        /**
         * @function navigateToDetails
         * @description Navigates to an asset's detail page
         * @param {can.Map} itemData The data of the item to navigate to
         */
        navigateToDetails: function (itemData) {
            var appState = this.attr('state');
            var key = this.attr('detailsKey');
            var routeData = {};
            var type = this.attr('type');

            if (itemData && appState && key) {
                routeData.page = type + '-details';
                routeData.route = appState.attr('route') + '/:' + key;
                routeData[key] = itemData.attr(key);
                routeData.version = appState.attr('version');
                routeData.versionLocked = appState.attr('versionLocked');

                // Add marketing context to the route if it’s desired on the details page
                if (appState.attr('layoutState.childrenHaveMarketingContext')) {
                    routeData.format = 'common';
                    routeData.geo = 'ww';
                    routeData.segment = 'all';
                }

                // Updates the app state and changes the route
                appState.setRouteAttrs(routeData);
            }
        },

        /**
         * @function setContext
         * @description Sets marketing context application state variables, based on passed-in hash values.
         * @param {Object} hash Object containing marketing context values to set
         */
        setContext: function (hash) {
            var appState = this.attr('state');

            if (appState) {
                appState.attr({
                    format: hash.format,
                    geo: hash.geo,
                    languageCode: hash.languageCode,
                    segment: hash.segment
                });
            }
        },

        toggleAdvSearchTab: function () {
            var multiSearchEnabled = this.attr('multiSearchEnabled');
            var searchEnabled = this.attr('searchStateEnabled');

            this.attr('multiSearchEnabled', !multiSearchEnabled);

            if (!this.attr('multiSearchActive')) {
                this.attr('searchStateEnabled', !searchEnabled);
            }
        }
    }
);
