var canBatch = require('can-event/batch/batch');
var CanMap = require('can-map');
var CanList = require('can-list');
var User = require('seo-ui/models/user/user');

require('can-map-define');

var Layout = CanMap.extend({
    define: {
        hideFooter: {
            type: 'boolean',
            value: false
        },

        hideHeader: {
            type: 'boolean',
            value: false
        }
    }
});

module.exports = CanMap.extend({
    define: {
        alert: {
            type: '*',
            set: function (newVal) {
                this.attr('isAlertVisible', Boolean(newVal));
                return newVal;
            },
            serialize: false
        },

        error: {
            serialize: false,
            type: '*'
        },

        isAlertVisible: {
            serialize: false,
            type: 'boolean',
            value: false
        },

        layoutState: {
            // Since we already have our defaults defined,
            // our default 'value' can just be set to an empty
            // object. The `Type` will mean the default value of
            // layoutState is set to `new Layout({})`
            value: function () {
                return {};
            },

            // Any time the entire layoutState property is replaced,
            // the new object will be passed to the Layout constructor
            // which preserves defaults
            Type: Layout,
            serialize: false
        },

        page: {
            type: 'string'
        },

        /**
         * Storage is used to maintain data between page transitions. If a page must pass data
         * to another page, it can be set in `appState.storage`. Remember to always remove the
         * temporary data on data retrieval.
         */
        storage: {
            serialize: false,
            value: function () {
                return {};
            }
        },

        user: {
            Type: User,
            serialize: false
        },

        /**
         * @property {object} appstate.viewModel.version version
         * @description The app-version
         */
        version: {
            type: 'string',
            serialize: false
        },

        /**
         * @property {Array} appstate.viewModel.navMenuItems
         * @description The navigation bar links
         */
        navMenuItems: {
            Type: CanList,
            serialize: false,
            get: function () {
                var links = [
                    {
                        iconClass: 'icon-home',
                        label: 'SEO Metadata',
                        pageName: 'url-list'
                    },
                    {
                        iconClass: 'icon-loop',
                        label: 'Generate',
                        pageName: 'generate-page'
                    },
                    {
                        iconClass: 'icon-eye',
                        label: 'Review',
                        pageName: 'review-page'
                    },
                    {
                        iconClass: 'icon-list',
                        label: 'Request List',
                        pageName: 'request-list'
                    }
                ];

                return links;
            }
        },

        /**
         * @property {Boolean} appstate.viewModel.navIsExpanded
         * @description Indicates if the navigation bar is expanded or collapsed
         */
        navIsExpanded: {
            type: 'boolean',
            serialize: false
        }
    },

    /**
     * @function setRouteAttrs
     * @description Reset the AppState to the value of routeParams but
     * preserve properties that are required across different routes.
     * @param {Object} routeParams The new route parameters.
     */
    setRouteAttrs: function (routeParams) {
        // Preserves required props
        var conflictsEnabled = this.attr('conflictsEnabled');
        var storage = this.attr('storage');
        var user = this.attr('user');

        // Updates the state to the route params, removing all props that are not in `routeParams`
        canBatch.start();
        this.attr(routeParams, true);

        // Adds required props back in
        this.attr('user', user);
        this.attr('storage', storage);
        this.attr('conflictsEnabled', conflictsEnabled);
        canBatch.stop();
    }
});
