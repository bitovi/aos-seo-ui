var can = require('can');
var User = require('seo-ui/models/user/user');

require('can/map/define/define');

var Layout = can.Map.extend({
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

module.exports = can.Map.extend({
    define: {
        page: {
            type: 'string'
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

        error: {
            serialize: false,
            type: '*'
        },

        isAlertVisible: {
            serialize: false,
            type: 'boolean',
            value: false
        },

        alert: {
            serialize: false,
            set: function (newVal) {
                this.attr('isAlertVisible', Boolean(newVal));
                return newVal;
            },
            type: '*'
        },

        user: {
            Type: User,
            serialize: false
        },

        /**
         * @property {object} app-state.viewModel.version version
         * @description The app-version
         */
        version: {
            type: 'string',
            serialize: false
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
        can.batch.start();
        this.attr(routeParams, true);

        // Adds required props back in
        this.attr('user', user);
        this.attr('storage', storage);
        this.attr('conflictsEnabled', conflictsEnabled);
        can.batch.stop();
    }
});
